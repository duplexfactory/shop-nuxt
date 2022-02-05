import {IncomingMessage, ServerResponse} from "http";
import {reviewCollection} from "~/server/firebase/collections";
import {useMethod, useBody} from 'h3';

export default async function (req: IncomingMessage, res: ServerResponse): Promise<{ id: string }> {

    if (useMethod(req) != "POST") {
        res.statusCode = 405
        res.end()
        throw new Error()
    }

    const {pagePk, mediaId, content, rating, ip} = await useBody<{ pagePk: number, mediaId: string | undefined, content: string, rating: number, ip: string }>(req);
    const review = {
        pagePk,
        mediaId,
        rating,
        content,
        created: Date.now(),
        deleted: false,
        ip
    };

    const reference = await reviewCollection().add(review);
    return {
        id: reference.id
    }
}
