import type {IncomingMessage, ServerResponse} from 'http'
import {sendError, useQuery} from 'h3'
import type IgMedia from "~/models/IgMedia";
import {getMediaByCode, initDynamo} from "~/server/dynamodb";
import {badRequest, notFound} from "~/server/util";

export default async function (req: IncomingMessage, res: ServerResponse): Promise<{ media: IgMedia }> {
    const {code} = await useQuery(req) as { code: string }

    let queryId: number
    if (code) {
        initDynamo();
        const media = await getMediaByCode(code);
        if(!media) {
            sendError(res, notFound)
        }
        return {media}
    } else {
        // Page deleted
        throw sendError(res, badRequest)
    }
}
