import dayjs from "dayjs"
import IgMedia from "~/models/IgMedia"

export interface IgOfficialMedia {
    caption: string,
    permalink: string,
    timestamp: string,
    media_url?: string
}

export async function fetchIgMedias(token: string, returnMediaUrl: boolean, pg?: { limit: number, after?: string }) {
    const mediaUrl = new URL("https://graph.instagram.com/me/media")
    mediaUrl.searchParams.set("fields", "caption,permalink,timestamp" + (returnMediaUrl ? "," : ""))
    mediaUrl.searchParams.set("access_token", token)
    if (pg?.limit) mediaUrl.searchParams.set("limit", pg.limit)
    if (pg?.after) mediaUrl.searchParams.set("after", pg.after)
    const mediaRes = await fetch(mediaUrl.href)
    const {data, paging} = await mediaRes.json() as {
        data: IgOfficialMedia[]
        paging: any
    }
    const medias = ms.map(m => ({
        code: m.permalink.split("/").filter(t => !!t).pop(),
        pageId,
        caption: m.caption || "",
        takenAt: dayjs(m.timestamp).unix(),
        mediaUrl: m.media_url
    })) as IgMedia[]
    medias.forEach(m => {
        if (!m.mediaUrl) delete m.mediaUrl
    })
    return {
        medias,
        nextToken: paging?.cursors?.after
    }
}
