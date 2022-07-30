import {defineEventHandler, JSONValue, useQuery} from "h3"
import {initMongo, mediaCommerceDataCollection} from "~/server/mongodb"

export default defineEventHandler(async (event) => {
    let {
        codes
    } = await useQuery(event) as { codes: string }

    const mediaCodeList = codes.split(",")
    await initMongo()
    const mediaCommerceDataList = await mediaCommerceDataCollection.find({
        _id: { $in: mediaCodeList }
    }).toArray()

    return {
        data: mediaCommerceDataList.reduce((prev, curr) => {
            prev[curr._id] = curr
            return prev
        }, {})
    } as unknown as JSONValue
    // { medias: IgMedia[] }
})
