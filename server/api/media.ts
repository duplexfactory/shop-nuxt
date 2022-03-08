import type {IncomingMessage, ServerResponse} from 'http'
import {useQuery} from 'h3'
import type IgMedia from "~/models/IgMedia";
import {getPageMedias, initDynamo} from "~/server/dynamodb";
import {initMongo, pageSearchCollection} from "~/server/mongodb";

export default async function (req: IncomingMessage, res: ServerResponse): Promise<{ medias: IgMedia[] }> {
    let {id, username} = await useQuery(req) as { id: string, username: string }

    let queryId: number
    if (id) {
        queryId = Number(id)
    } else {
        await initMongo();
        const p = await pageSearchCollection.findOne({username}, {projection: {_id: 1}});
        queryId = p._id
    }

    initDynamo();
    return {
        medias: await getPageMedias(queryId)
    }
}
