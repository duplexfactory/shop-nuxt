import fetch from "node-fetch"
import {createError, defineEventHandler, useQuery} from "h3"
import dayjs from "dayjs"
import {nanoid} from "nanoid"

import {igAuthCollection, initMongo, pageSearchCollection} from "~/server/mongodb"
import {assert, getAuth, noCache} from "~/server/util"
import IgPage from "~/models/IgPage"
import IgMedia from "~/models/IgMedia"
import {getPageMedias, initDynamo, saveMedias} from "~/server/dynamodb"
import {pageCollection} from "~/server/firebase/collections"
import {createPageSearchDoc, PageSearch} from "~/models/PageSearch"
import {fetchIgMedias, fetchIgProfile} from "~/server/instagram"
import {detectPrice} from "~/utils/from-crawler/detect-price";

export default defineEventHandler(async (event) => {
    noCache(event)
    const auth = getAuth(event)
    await initMongo()

    const {code} = useQuery(event)

    // exchange code for short lived access token
    const form = new URLSearchParams()
    const config = useRuntimeConfig()
    form.append("client_id", config.IG_APP_ID)
    form.append("client_secret", config.IG_APP_SECRET)
    form.append("grant_type", "authorization_code")
    form.append("redirect_uri", config.DOMAIN + `/my/account`)
    form.append("code", code as string)

    const shortTokenRes = await fetch("https://api.instagram.com/oauth/access_token", {
        method: "POST",
        body: form
    })
    const shortTokenResJ = await shortTokenRes.json()
    const {
        access_token: shortToken,
        user_id: userId
    } = shortTokenResJ as { access_token: string, user_id: number }
    assert(shortToken, createError({
        statusCode: 500,
        data: {
            url: shortTokenRes.url,
            body: shortTokenResJ
        }
    }))

    // get username
    const {id, username, media_count} = await fetchIgProfile(shortToken)

    // exchange short lived access token for long lived access token
    const tokenUrl = new URL("https://graph.instagram.com/access_token")
    tokenUrl.searchParams.set("grant_type", "ig_exchange_token")
    tokenUrl.searchParams.set("client_secret", config.IG_APP_SECRET)
    tokenUrl.searchParams.set("access_token", shortToken)
    const longTokenRes = await fetch(tokenUrl.href)
    const longTokenResJ = await longTokenRes.json()
    const {
        access_token: longToken,
        expires_in
    } = longTokenResJ as { access_token: string, expires_in: number }
    assert(longToken, createError({
        statusCode: 500,
        data: {
            url: longTokenRes.url,
            body: longTokenResJ
        }
    }))

    assert(username, createError({statusCode: 401, statusMessage: "Instagram Permission Needed"}))

    const pageDoc = await pageCollection().where("username", "==", username).get()
    const [page] = pageDoc.data()
    const pageId = page ? (page._id || page.pk.toString()) : nanoid()

    await igAuthCollection.updateOne({username}, {
        $set: {
            userId: auth.uid,
            pageId,
            username,
            localUserId: userId,
            expiry: dayjs().add(expires_in, "seconds").toDate(),
            accessToken: longToken
        }
    }, {upsert: true})

    // create page
    if (!page) {
        const p: Partial<IgPage> = {
            _id: pageId,
            temp: true,
            pk: 0,
            username,
            fullName: "",
            biography: "",
            mediaCount: media_count,
            nextFetch: 1,
            adult: false,
            locations: [],
            extraData: {},
            tags: [],
            deleted: false,
            igConnected: true
        }
        await pageSearchCollection.updateOne({_id: pageId}, {$set: p}, {upsert: true})
        await pageCollection().doc(pageId).set(p, {merge: true})
    } else {
        const p: Partial<IgPage> = createPageSearchDoc(pageId, page)
        p.deleted = false
        p.igConnected = true
        await pageSearchCollection.updateOne({_id: pageId}, {$set: p}, {upsert: true})
        await pageCollection().doc(pageId).update({igConnected: true, deleted: false}) // set deleted to false incas deleted in crawler project.
        // await pageCollection().doc(pageId).set({mediaCount: media_count, deleted: false}, {merge: true})
    }

    // fetch medias
    const medias = await fetchIgMedias(pageId, longToken, false)

    if (medias.length) {
        initDynamo()

        medias.forEach((m) => {
            if (!!m.caption) {
                const price = detectPrice(m.caption)
                if (price !== undefined)
                    m.price = price
            }
        })
        await saveMedias(medias)

        const lastMedia = medias[0]

        const update = {
            lastMedia: lastMedia.takenAt,
            lastActivity: lastMedia.takenAt,
            lastMediaData: lastMedia,
            mediaCount: media_count,
            mediaCodes: medias.slice(0, 3).map((m) => m.code)
        }
        await pageSearchCollection.updateOne({_id: pageId}, {$set: update})
        await pageCollection().doc(pageId).update(update)
    }

    return {accessToken: longToken, userId, id, username}
})
