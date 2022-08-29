import {defineEventHandler, getQuery} from "h3"
import {initMongo, mediaCommerceDataCollection} from "~/server/mongodb"
import {isEmpty} from "~/utils/isEmpty";
import {IgMediaCommerceData} from "~/models/IgMediaCommerceData";
import {Filter} from "mongodb";

export default defineEventHandler(async (event) => {
    let {
        codes,
        active,
        pageId,
    } = await getQuery(event) as {
        codes?: string,
        active?: string,
        pageId?: string
    }

    await initMongo()
    const filter: Filter<IgMediaCommerceData> = {}
    if (!!codes) {
        filter._id = { $in: codes.split(",") }
    }
    if (!isEmpty(active)) {
        filter.active = Boolean(active)
    }
    if (!!pageId) {
        filter.pageId = pageId
    }
    const mediaCommerceDataList = await mediaCommerceDataCollection.find(filter).toArray()

    return {
        data: mediaCommerceDataList.reduce((prev, curr) => {
            prev[curr._id] = curr
            return prev
        }, {})
    }
    // { medias: IgMedia[] }
})
