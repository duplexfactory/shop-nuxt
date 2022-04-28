import {defineEventHandler, JSONValue, useQuery} from "h3"
import {getPageMedias, initDynamo} from "~/server/dynamodb"
import {initMongo, pageSearchCollection} from "~/server/mongodb"
import dayjs from "dayjs"
import {notFound} from "~/utils/h3Error"
import {assert} from "~/server/util"

export default defineEventHandler(async (event) => {
    let {
        id,
        username,
        limit,
        before
    } = await useQuery(event) as { id: string, username: string, limit: string, before: string }

    let queryId: string
    if (id) {
        queryId = id
    } else {
        await initMongo()
        const p = await pageSearchCollection.findOne({username}, {projection: {_id: 1}})
        assert(event, p, notFound)
        queryId = p._id
    }

    initDynamo()
    return {
        medias: await getPageMedias(queryId, limit ? Number(limit) : undefined, before ? Number(before) : dayjs().unix())
    } as unknown as JSONValue
    // { medias: IgMedia[] }
})
