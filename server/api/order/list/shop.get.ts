import {defineEventHandler, JSONValue, useQuery} from "h3";
import {assert, getAuth, noCache} from "~/server/util";
import {igAuthCollection, initMongo, orderCollection, pageSearchCollection} from "~/server/mongodb";
import {notFound} from "~/utils/h3Error";
import {PaginationQuery} from "~/models/PaginationQuery";
import {QueryObject} from "ufo";

export default defineEventHandler(async (event) => {

    noCache(event)
    const auth = getAuth(event)
    await initMongo()

    const igAuth = await igAuthCollection.findOne({
        userId: auth.uid
    })

    assert(igAuth, notFound)


    const {
        skip,
        limit
    } = await useQuery(event) as (QueryObject & PaginationQuery)
    const filter = {
        [`shops.${igAuth.pageId}`]: {$exists: true}
    }
    const orders = await orderCollection.find(filter).sort({
        created: -1
    }).skip(Number(skip) || 0).limit(Number(limit) || 0).toArray()

    return {
        orders,
        count: await orderCollection.countDocuments(filter)
    } as unknown as JSONValue
})