import {defineEventHandler, JSONValue, useQuery} from "h3"
import {initMongo, mediaCommerceDataCollection} from "~/server/mongodb"
import {isEmpty} from "~/utils/isEmpty";
import {IgMediaCommerceData} from "~/models/IgMediaCommerceData";
import {Filter} from "mongodb";

export default defineEventHandler(async (event) => {
    let {
        codes,
        active
    } = await useQuery(event) as {
        codes?: string,
        active?: string
    }

    await initMongo()
    const filter: Filter<IgMediaCommerceData> = {}
    if (!!codes) {
        filter._id = { $in: codes.split(",") }
    }
    if (!isEmpty(active)) {
        filter.active = Boolean(active)
    }
    const mediaCommerceDataList = await mediaCommerceDataCollection.find(filter).toArray()

    return {
        data: mediaCommerceDataList.reduce((prev, curr) => {
            prev[curr._id] = curr
            return prev
        }, {})
    } as unknown as JSONValue
    // { medias: IgMedia[] }
})
