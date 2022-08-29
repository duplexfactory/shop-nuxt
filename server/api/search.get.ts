import {defineEventHandler, useQuery} from "h3"
import {initMongo, pageSearchCollection} from "~/server/mongodb"
import {PageSearch} from "~/models/PageSearch"
import {Filter, RootFilterOperators} from "mongodb"

function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") // $& means the whole matched string
}

export default defineEventHandler(async (event) => {
    const {
        q,
        tag,
        br,
        phy,
        skip,
        limit,
        adult
    } = await useQuery(event) as { q?: string, tag?: string, br?: string, phy?: string, skip: string, limit: string, adult: string }

    let f: Filter<PageSearch> = {}

    if (q) {
        const keywords = q.split(/\s/);
        (f as RootFilterOperators<PageSearch>).$and = keywords.filter(k => !!k).map(keyword => ({
            $or: [
                {username: {$regex: escapeRegExp(keyword), $options: "i"}},
                {fullName: {$regex: escapeRegExp(keyword), $options: "i"}},
                {biography: {$regex: escapeRegExp(keyword), $options: "i"}},
            ]
        }))
    }

    if (tag) f.tags = tag
    if (br) f.businessRegistration = true
    if (phy) f.brickAndMortar = true
    if (adult !== "true") f.adult = false

    await initMongo()

    event.res.setHeader("Cache-Control", "max-age=120")

    return {
        pages: await pageSearchCollection.find(f).sort({
            activeScore: -1,
            lastActivity: -1
        }).skip(Number(skip) || 0).limit(Number(limit) || 0).toArray(),
        count: await pageSearchCollection.countDocuments(f)
    }

    // { pages: PageSearch[], count: number }
})
