import type {IncomingMessage, ServerResponse} from 'http'
import {mediaCollection, pageCollection} from "~/server/firebase/collections";
import {useQuery} from 'h3'
import type IgPage from "~/models/IgPage";
import type IgMedia from "~/models/IgMedia";

export default async function (req: IncomingMessage, res: ServerResponse): Promise<{ page: IgPage, medias: IgMedia[] }> {
    const {id} = await useQuery(req) as { id: string }

    const pageDoc = await pageCollection().doc(id).get()
    if (!pageDoc.exists) {
        res.statusCode = 404
        res.end()
        throw new Error()
    }

    return {
        page: pageDoc.data(),
        medias: await mediaCollection(id).get().then(m => m.data())
    }
}
