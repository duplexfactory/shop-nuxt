import {defineEventHandler} from "h3"
import {getMediaByCode, initDynamo} from "~/server/dynamodb"
import {assert} from "~/server/util"
import {notFound} from "~/utils/h3Error"

export default defineEventHandler(async (event) => {
    const {code} = event.context.params
    assert(code)

    initDynamo()
    const media = await getMediaByCode(code)
    assert(media, notFound)

    return {media}
})
