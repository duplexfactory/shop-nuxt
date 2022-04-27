import {defineEventHandler, JSONValue} from "h3"
import {oldGetMediaByCode, initDynamo} from "~/server/dynamodb"
import {assert} from "~/server/util"
import {notFound} from "~/utils/h3Error"

export default defineEventHandler(async (event) => {
    const {code} = event.context.params
    assert(event, code)

    initDynamo()
    const media = await oldGetMediaByCode(code)
    assert(event, media, notFound)

    return {media} as unknown as JSONValue
})
