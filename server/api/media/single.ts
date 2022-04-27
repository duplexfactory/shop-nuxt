import {defineEventHandler, JSONValue, sendError, useQuery} from 'h3'
import type IgMedia from "~/models/IgMedia";
import {oldGetMediaByCode, initDynamo} from "~/server/dynamodb";
import {badRequest, notFound} from "~/utils/h3Error";

export default defineEventHandler(async (event) => {
    const {code} = await useQuery(event) as { code: string }

    if (!code) {
        // Page deleted
        throw sendError(event, badRequest)
    }

    initDynamo();
    const media = await oldGetMediaByCode(code);
    if (!media) {
        throw sendError(event, notFound)
    }
    return {media} as unknown as JSONValue
    // { media: IgMedia }
})
