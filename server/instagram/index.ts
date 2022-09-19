import dayjs from "dayjs"
import IgMedia from "~/models/IgMedia"
import fetch from "node-fetch"
import {igAuthCollection, initMongo} from "~/server/mongodb"

export interface IgOfficialMedia {
    id: string,
    caption: string,
    permalink: string,
    timestamp: string,
    media_type: "CAROUSEL_ALBUM" | "IMAGE" | "VIDEO",
    media_url?: string,
    children?: any, // CAROUSEL_ALBUM
    thumbnail_url?: string // VIDEO
}

export async function fetchIgMedias(pageId: string, token: string, returnMediaUrl: boolean, pg?: { limit: number, until?: number, since?: number, before?: string, after?: string }) {
    const mediaUrl = new URL("https://graph.instagram.com/me/media")
    mediaUrl.searchParams.set("fields", "caption,permalink,timestamp,media_type,thumbnail_url" + (returnMediaUrl ? ",media_url,children" : ""))
    mediaUrl.searchParams.set("access_token", token)
    if (pg?.limit) mediaUrl.searchParams.set("limit", pg.limit.toString())
    if (pg?.until) mediaUrl.searchParams.set("until", pg.until.toString())
    if (pg?.since) mediaUrl.searchParams.set("since", pg.since.toString())
    if (pg?.before) mediaUrl.searchParams.set("before", pg.before.toString())
    if (pg?.after) mediaUrl.searchParams.set("after", pg.after.toString())
    const mediaRes = await fetch(mediaUrl.href)
    const {data, paging} = await mediaRes.json() as {
        data: IgOfficialMedia[]
        paging: { cursors: { before: string, after: string } }
    }
    if (!data) {
        if (mediaRes.status == 400) {
            // Page connection problem.
            await initMongo()
            await igAuthCollection.updateOne({pageId}, {$set: {invalid: true}})
        }
        return {
            medias: [],
            paging: undefined
        }
    }
    const medias = await Promise.all(data.map(async (m) => officialMediaToMedia(m, pageId, token)))
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

export async function fetchIgMediaChildren(mediaId: string, accessToken: string) {
    const url = new URL(`https://graph.instagram.com/${mediaId}/children`)
    url.searchParams.set("fields", "media_url")
    url.searchParams.set("access_token", accessToken)

    const res = await fetch(url.href)
    const {data} = await res.json() as { data: { media_url: string }[] }
    return data.map(d => d.media_url)
}

export async function fetchIgMedia(pageId: string, mediaId: string, accessToken: string) {
    const url = new URL(`https://graph.instagram.com/${mediaId}`)
    url.searchParams.set("fields", "caption,permalink,timestamp,media_type,media_url,thumbnail_url,children")
    url.searchParams.set("access_token", accessToken)
    const res = await fetch(url.href)
    const rawMedia = await res.json() as IgOfficialMedia

    if (!rawMedia.id) return null
    return await officialMediaToMedia(rawMedia, pageId, accessToken)
}

async function officialMediaToMedia(rawMedia: IgOfficialMedia, pageId: string, accessToken: string) {
    const media: IgMedia = {
        code: rawMedia.permalink.split("/").filter(t => !!t).pop(),
        pageId,
        mediaId: rawMedia.id,
        caption: rawMedia.caption || "",
        takenAt: dayjs(rawMedia.timestamp).unix(),
        mediaType: rawMedia.media_type
    }
    if (rawMedia.media_url) media.mediaUrl = rawMedia.media_url

    if (rawMedia.media_type === "CAROUSEL_ALBUM") {
        media.mediaList = await fetchIgMediaChildren(rawMedia.id, accessToken)
    } else if (rawMedia.media_type === "VIDEO") {
        media.thumbnailUrl = rawMedia.thumbnail_url
    }
    return media
}
