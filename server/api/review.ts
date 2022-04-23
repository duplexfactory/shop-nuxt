import {reviewCollection} from "~/server/firebase/collections";
import {assertMethod, defineEventHandler, useBody} from 'h3';
import {noCache} from "~/server/util";
import {IncomingMessage} from "http";

export default defineEventHandler(async (event) => {
    noCache(event)
    assertMethod(event, "POST")

    const {pagePk, mediaCode, content, rating} = await useBody<{ pagePk: number, mediaCode: string | undefined, content: string, rating: number}>(event);
    const review = {
        pagePk,
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
