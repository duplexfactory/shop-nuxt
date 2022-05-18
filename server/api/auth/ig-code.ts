import fetch from "node-fetch"
import {createError, defineEventHandler, useQuery} from "h3"
import dayjs from "dayjs"
import {nanoid} from "nanoid"

import {igAuthCollection, initMongo, pageSearchCollection} from "~/server/mongodb"
import {assert, getAuth, noCache} from "~/server/util"
import IgPage from "~/models/IgPage"
import IgMedia from "~/models/IgMedia"
import {initDynamo, saveMedias} from "~/server/dynamodb"
import {pageCollection} from "~/server/firebase/collections"

interface RawMedia {
    "caption": string,
    "permalink": string,
    "timestamp": string
}

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
    const url = new URL("https://graph.instagram.com/me")
    url.searchParams.set("fields", "id,username,media_count")
    url.searchParams.set("access_token", shortToken)
    const idRes = await fetch(url.href)
    const idResJ = await idRes.json()
    const {id, username, media_count} = idResJ as { id: string, username: string, media_count: number }
    assert(shortToken, createError({
        statusCode: 500,
        data: {
            url: idRes.url,
            body: idResJ
        }
    }))

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

    const page = await pageSearchCollection.findOne({username}) as { _id: string }
    const pageId = page ? page._id : nanoid()

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
            deleted: false
        }
        await pageSearchCollection.updateOne({_id: pageId}, {$set: p}, {upsert: true})
        await pageCollection().doc(pageId).set(p, {merge: true})
    }
    // else {
    //     await pageCollection().doc(pageId).set({mediaCount: media_count, deleted: false}, {merge: true})
    // }

    // fetch medias
    const mediaUrl = new URL("https://graph.instagram.com/me/media")
    mediaUrl.searchParams.set("fields", "caption,permalink,timestamp")
    mediaUrl.searchParams.set("access_token", longToken)
    const mediaRes = await fetch(mediaUrl.href)
    const mediaResJ = await mediaRes.json()
    const {data: medias} = mediaResJ as { data: RawMedia[] }
    assert(medias, createError({
        statusCode: 500,
        data: {
            url: mediaRes.url,
            body: mediaResJ
        }
    }))

    if (medias.length) {
        const dMedias: IgMedia[] = medias.map(m => ({
            code: m.permalink.split("/").filter(t => !!t).pop(),
            pageId,
            caption: m.caption || "",
            takenAt: dayjs(m.timestamp).unix(),
        }))
        initDynamo()
        await saveMedias(dMedias)

        const lastMedia = dMedias[0]

        const update = {
            lastMedia: lastMedia.takenAt,
            lastActivity: lastMedia.takenAt,
            lastMediaData: lastMedia,
            mediaCount: media_count
        }
        await pageSearchCollection.updateOne({_id: pageId}, {$set: update})
        await pageCollection().doc(pageId).update(update)
    }

    return {accessToken: longToken, userId, id, username}
})
