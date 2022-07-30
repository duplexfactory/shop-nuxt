import {defineEventHandler, JSONValue, useQuery} from "h3";
import {assert} from "~/server/util";
import {initMongo, pageCommerceDataCollection} from "~/server/mongodb";
import {badRequest, notFound} from "~/utils/h3Error";
import Dict = NodeJS.Dict;
import {IgPageCommerceData} from "~/models/IgPageCommerceData";

export default defineEventHandler(async (event) => {
    let {
        ids
    } = await useQuery(event) as { ids: string }

    assert(!!ids, badRequest)

    await initMongo();
    const commerceData = await pageCommerceDataCollection.find({
        _id: {$in: ids.split(",")}
    }).toArray()

    return {
        commerceData: commerceData.reduce((previous, current) => {
            previous[current._id] = current
            return previous;
        }, {} as Dict<IgPageCommerceData>) as any
    };
})
