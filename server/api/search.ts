import {defineEventHandler, JSONValue, useQuery} from 'h3';
import {initMongo, pageSearchCollection} from "~/server/mongodb";
import {PageSearch} from "~/models/PageSearch";
import {Filter} from "mongodb";

function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
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
    } = await useQuery(event) as { q?: string, tag?: string, br?: string, phy?: string, skip: string, limit: string, adult: string };

    const f: Filter<PageSearch> = q ? {
        $or: [
            {username: {$regex: escapeRegExp(q), $options: "i"}},
            {fullName: {$regex: escapeRegExp(q), $options: "i"}},
            {biography: {$regex: escapeRegExp(q), $options: "i"}},
        ]
    } : {};

    if (tag) f.tags = tag;
    if (br) f.businessRegistration = true;
    if (phy) f.brickAndMortar = true;
    if (adult !== "true") f.adult = false;

    await initMongo();

    event.res.setHeader("Cache-Control", "max-age=120");

    return {
        pages: await pageSearchCollection.find(f).sort({activeScore: -1, lastActivity: -1}).skip(Number(skip) || 0).limit(Number(limit) || 0).toArray(),
        count: await pageSearchCollection.countDocuments(f)
    } as unknown as JSONValue

    // { pages: PageSearch[], count: number }
})
