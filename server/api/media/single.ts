import {defineEventHandler, JSONValue, useQuery} from "h3"
import {getMediaByCode, initDynamo} from "~/server/dynamodb"
import {notFound} from "~/utils/h3Error"
import {assert} from "~/server/util"

export default defineEventHandler(async (event) => {
    const {code} = await useQuery(event) as { code: string }
    assert(code)

    initDynamo()
    const media = await getMediaByCode(code)
    assert(media, notFound)

    return {media} as unknown as JSONValue
})
