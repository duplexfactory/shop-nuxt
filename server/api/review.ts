import {IncomingMessage, ServerResponse} from "http";
import {reviewCollection} from "~/server/firebase/collections";
import {useMethod, useBody, assertMethod} from 'h3';

export default async function (req: IncomingMessage, res: ServerResponse): Promise<{ id: string }> {
    assertMethod(req, "POST")

    const {pagePk, mediaCode, content, rating} = await useBody<{ pagePk: number, mediaCode: string | undefined, content: string, rating: number}>(req);
    const review = {
        pagePk,
        mediaCode,
        rating,
        content,
        created: Date.now(),
        deleted: false,
        ip: req.connection.remoteAddress || req.socket.remoteAddress || ""
    };

    const reference = await reviewCollection().add(review);
    return {
        id: reference.id
    }
}
