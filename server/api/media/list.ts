import type {IncomingMessage, ServerResponse} from 'http'
import {sendError, useQuery} from 'h3'
import type IgMedia from "~/models/IgMedia";
import {getPageMedias, initDynamo} from "~/server/dynamodb";
import {initMongo, pageSearchCollection} from "~/server/mongodb";
import dayjs from "dayjs";
import {notFound} from "~/server/util";

export default async function (req: IncomingMessage, res: ServerResponse): Promise<{ medias: IgMedia[] }> {
    let {
        id,
        username,
        limit,
        before
    } = await useQuery(req) as { id: string, username: string, limit: string, before: string }

    let queryId: number
    if (id) {
        queryId = Number(id)
    } else {
        await initMongo();
        const p = await pageSearchCollection.findOne({username}, {projection: {_id: 1}});
        if (!p) {
            // Page deleted
            throw sendError(res, notFound)
        }
        queryId = p._id
    }

    initDynamo();
    return {
        medias: await getPageMedias(queryId, limit ? Number(limit) : undefined, before ? Number(before) : dayjs().unix())
    }
}
