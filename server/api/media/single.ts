import type {IncomingMessage, ServerResponse} from 'http'
import {useQuery} from 'h3'
import type IgMedia from "~/models/IgMedia";
import {getMediaByCode, initDynamo} from "~/server/dynamodb";

export default async function (req: IncomingMessage, res: ServerResponse): Promise<{ media: IgMedia }> {
    const {code} = await useQuery(req) as { code: string }

    let queryId: number
    if (code) {
        initDynamo();
        const media = await getMediaByCode(code);
        if(!media) {
            res.statusCode = 404
            res.end()
            throw new Error()
        }
        return {media}
    } else {
        // Page deleted
        res.statusCode = 400
        res.end()
        throw new Error()
    }
}
