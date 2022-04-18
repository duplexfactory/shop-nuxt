import {IncomingMessage, ServerResponse} from "http"
import fetch from "node-fetch"
import {useQuery} from "h3"
import dayjs from "dayjs"

import config from "#config"
import {igAuthCollection, initMongo, pageSearchCollection} from "~/server/mongodb"
import {UpdateFilter} from "mongodb";
import IgAuth from "~/models/IgAuth";

export default async function (req: IncomingMessage, res: ServerResponse) {
    await initMongo()

    const {code} = useQuery(req)

    // exchange code for short lived access token
    const form = new URLSearchParams()
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

    const update: UpdateFilter<IgAuth> = {
        $set: {
            username,
            expiry: dayjs().add(expires_in, "seconds").toDate(),
            accessToken: longToken
        }
    }
    const page = await pageSearchCollection.findOne({username})
    if (page) update.$set.pk = page.pk

    await igAuthCollection.updateOne({localUserId: userId}, update, {upsert: true})

    return {accessToken: longToken, userId, id, username}
}
