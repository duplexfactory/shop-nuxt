import {defineEventHandler, getQuery} from "h3";
import {assert} from "~/server/util";
import {initMongo, pageCommerceDataCollection} from "~/server/mongodb";
import {badRequest, notFound} from "~/utils/h3Error";

export default defineEventHandler(async (event) => {
    let {
        ids
    } = await getQuery(event) as { ids: string }

    assert(!!ids, badRequest)

    await initMongo();
    const commerceData = await pageCommerceDataCollection.find({
        _id: {$in: ids.split(",")}
    }).toArray()

    return {
        commerceData: commerceData.reduce((previous, current) => {
            previous[current._id] = current
            return previous;
        }, {})
    };
})
