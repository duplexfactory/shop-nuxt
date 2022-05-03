import fetch from "node-fetch"
import {defineEventHandler, useQuery} from "h3"
import dayjs from "dayjs"
import {nanoid} from "nanoid"

import {igAuthCollection, initMongo, pageSearchCollection} from "~/server/mongodb"
import {noCache} from "~/server/util"
import IgPage from "~/models/IgPage"

interface RawMedia {
    "caption": string,
    "permalink": string,
    "timestamp": string
}

export default defineEventHandler(async (event) => {
    noCache(event)
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

    const shortTokenRes = await fetch(" https://api.instagram.com/oauth/access_token", {
        method: "POST",
        body: form
    })
    const {
        access_token: shortToken,
        user_id: userId
    } = await shortTokenRes.json() as { access_token: string, user_id: number }

    // get username
    const url = new URL("https://graph.instagram.com/me")
    url.searchParams.set("fields", "id,username")
    url.searchParams.set("access_token", shortToken)
    const idRes = await fetch(url.href)
    const {id, username} = await idRes.json() as { id: string, username: string }

    // exchange short lived access token for long lived access token
    const tokenUrl = new URL("https://graph.instagram.com/access_token")
    tokenUrl.searchParams.set("grant_type", "ig_exchange_token")
    tokenUrl.searchParams.set("client_secret", config.IG_APP_SECRET)
    tokenUrl.searchParams.set("access_token", shortToken)
    const longTokenRes = await fetch(tokenUrl.href)
    const {
        access_token: longToken,
        expires_in
    } = await longTokenRes.json() as { access_token: string, expires_in: number }

    const page = await pageSearchCollection.findOne({username}) as { _id: string }
    const pageId = page ? page._id : nanoid()

    await igAuthCollection.updateOne({username}, {
        $set: {
            pageId,
            username,
            localUserId: userId,
            expiry: dayjs().add(expires_in, "seconds").toDate(),
            accessToken: longToken
        }
    }, {upsert: true})

    // fetch medias
    const mediaUrl = new URL("https://graph.instagram.com/me/media")
    tokenUrl.searchParams.set("fields", "caption,permalink,timestamp")
    tokenUrl.searchParams.set("access_token", longToken)
    const mediaRes = await fetch(mediaUrl.href)
    const {data: medias} = await mediaRes.json() as { data: RawMedia }

    if (!page) {
        const p: Partial<IgPage> = {
            temp: true,
            pk: 0,
            username,
            fullName: "",
            biography: "",
            mediaCount: 0
        }
    }

    return {accessToken: longToken, userId, id, username}
})
