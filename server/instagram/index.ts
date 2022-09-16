import dayjs from "dayjs"
import IgMedia from "~/models/IgMedia"
import fetch from "node-fetch"
import {igAuthCollection, initMongo} from "~/server/mongodb";

export interface IgOfficialMedia {
    id: string,
    caption: string,
    permalink: string,
    timestamp: string,
    media_url?: string
}

export async function fetchIgMedias(pageId: string, token: string, returnMediaUrl: boolean, pg?: { limit: number, until?: number, since?: number, before?: string, after?: string }) {
    const mediaUrl = new URL("https://graph.instagram.com/me/media")
    mediaUrl.searchParams.set("fields", "caption,permalink,timestamp" + (returnMediaUrl ? ",media_url,children" : ""))
    mediaUrl.searchParams.set("access_token", token)
    if (pg?.limit) mediaUrl.searchParams.set("limit", pg.limit.toString())
    if (pg?.until) mediaUrl.searchParams.set("until", pg.until.toString())
    if (pg?.since) mediaUrl.searchParams.set("since", pg.since.toString())
    if (pg?.before) mediaUrl.searchParams.set("before", pg.before.toString())
    if (pg?.after) mediaUrl.searchParams.set("after", pg.after.toString())
    const mediaRes = await fetch(mediaUrl.href)
    const {data, paging} = await mediaRes.json() as {
        data: IgOfficialMedia[]
        paging: { cursors: {before: string, after: string} }
    }
    if (!data) {
        if (mediaRes.status == 400) {
            // Page connection problem.
            await initMongo()
            await igAuthCollection.updateOne({pageId}, {$set: {invalid: true}});
        }
        return {
            medias: [],
            paging: undefined
        }
    }
    const medias = data.map(m => ({
        code: m.permalink.split("/").filter(t => !!t).pop(),
        pageId,
        mediaId: m.id,
        caption: m.caption || "",
        takenAt: dayjs(m.timestamp).unix(),
        mediaUrl: m.media_url
    })) as IgMedia[]
    medias.forEach(m => {
        if (!m.mediaUrl) delete m.mediaUrl
    })
    return {
        medias,
        paging
    }
}

export async function fetchIgProfile(accessToken: string) {
    const url = new URL("https://graph.instagram.com/me")
    url.searchParams.set("fields", "id,username,media_count")
    url.searchParams.set("access_token", accessToken)
    const idRes = await fetch(url.href)
    return await idRes.json() as { id: string, username: string, media_count: number }
}
