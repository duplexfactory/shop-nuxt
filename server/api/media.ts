import type {IncomingMessage, ServerResponse} from 'http'
import {useQuery} from 'h3'
import type IgMedia from "~/models/IgMedia";
import {getPageMedias, initDynamo} from "~/server/dynamodb";

// example id 2305673031
export default async function (req: IncomingMessage, res: ServerResponse): Promise<{ medias: IgMedia[] }> {
    const {id} = await useQuery(req) as { id: string }
    initDynamo();
    return {
        medias: await getPageMedias(Number(id))
    }
}
