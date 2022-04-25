import {defineEventHandler, JSONValue} from 'h3'
import {getMediaByCode, initDynamo} from "~/server/dynamodb";
import {assert, notFound} from "~/server/util";

export default defineEventHandler(async (event) => {
    const code = event.req.originalUrl?.split("/").pop();
    assert(event, code)

    initDynamo();
    const media = await getMediaByCode(code);
    assert(event, media, notFound)

    return {media} as unknown as JSONValue
})
