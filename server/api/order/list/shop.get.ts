import {defineEventHandler, JSONValue, useQuery} from "h3";
import {assert, getAuth, noCache} from "~/server/util";
import {igAuthCollection, initMongo, orderCollection, pageSearchCollection} from "~/server/mongodb";
import {notFound} from "~/utils/h3Error";
import {PaginationQuery} from "~/models/PaginationQuery";
import {QueryObject} from "ufo";
import {Filter, ObjectId} from "mongodb";
import {Order, OrderStatus} from "~/models/Order";
import {isEmpty} from "~/utils/isEmpty";

function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") // $& means the whole matched string
}

export default defineEventHandler(async (event) => {

    const auth = getAuth(event)
    await initMongo()

    const igAuth = await igAuthCollection.findOne({
        userId: auth.uid
    })

    assert(igAuth, notFound)

    const {
        skip,
        limit,
        keyword,
        status
    } = await useQuery(event) as (QueryObject & PaginationQuery & {keyword?: string, status?: string})
    const filter : Filter<Order> = {
        [`shops.${igAuth.pageId}`]: {$exists: true}
    }
    if (!!keyword) {
        filter._id = ObjectId(keyword)
    }
    if (!isEmpty(status) && !isNaN(status)) {
        filter[`shops.${igAuth.pageId}.orderStatus`] = Number(status)
    }

    const orders = await orderCollection.find(filter).project({
        _id: true,
        created: true,
        [`shops.${igAuth.pageId}`]: true
    }).sort({
        created: -1
    }).skip(Number(skip) || 0).limit(Number(limit) || 0).toArray()

    return {
        orders,
        count: await orderCollection.countDocuments(filter)
    } as unknown as JSONValue
})
