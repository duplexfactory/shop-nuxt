import {defineEventHandler, getQuery} from "h3";
import {assert} from "~/server/util";
import {badRequest, notFound} from "~/utils/h3Error";
import {initMongo, pageSearchCollection} from "~/server/mongodb";

export default defineEventHandler(async (event) => {
    let {
        ids
    } = getQuery(event) as { ids: string }

    assert(!!ids, badRequest)

    await initMongo();
    const pages = await pageSearchCollection.find({
        _id: {$in: ids.split(",")}
    }).toArray()

    return {
        pages: pages.reduce((previous, current) => {
            previous[current._id] = current
            return previous;
        }, {})
    };
})
