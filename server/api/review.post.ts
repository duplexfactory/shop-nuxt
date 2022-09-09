import {reviewCollection} from "~/server/firebase/collections";
import {defineEventHandler, appendHeader} from 'h3';
import {noCache} from "~/server/util";
import {IncomingMessage} from "http";

export default defineEventHandler(async (event) => {
    noCache(event);

    const {pageId, mediaCode, content, rating} = await readBody<{ pageId: string, mediaCode: string | undefined, content: string, rating: number}>(event);
    const review = {
        pageId,
        mediaCode,
        rating,
        content,
        created: Date.now(),
        deleted: false,
        ip: (event.req as any as IncomingMessage).headers["cf-connecting-ip"] as string ||(event.req as any as IncomingMessage).connection.remoteAddress || (event.req as any as IncomingMessage).socket.remoteAddress || ""
    };

    const reference = await reviewCollection().add(review);
    return {
        id: reference.id
    }
})
