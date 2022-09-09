import {reviewCollection} from "~/server/firebase/collections";
import {defineEventHandler} from 'h3';
import {noCache} from "~/server/util";
import {IncomingMessage} from "http";
import IgPageReview from "~/models/IgPageReview"
import { s3 } from "~/server/s3";

export default defineEventHandler(async (event) => {

    noCache(event)
    const config = useRuntimeConfig()

    const body = await readBody<Omit<IgPageReview, "created" | "deleted" | "ip">>(event);
    const {
        imageUrls
    } = body

    // Generate document id.
    const docRef = reviewCollection().doc()
    const documentUuid = docRef.id

    const review = {
        ...body,
        created: Date.now(),
        deleted: false,
        ip: (event.req as any as IncomingMessage).headers["cf-connecting-ip"] as string || (event.req as any as IncomingMessage).connection.remoteAddress || (event.req as any as IncomingMessage).socket.remoteAddress || ""
    }
    if (!!imageUrls && imageUrls.length) {
        // Organize images on S3.
        await Promise.all(imageUrls.map((imageUrl) => {
            const pathInBucket = new URL(imageUrl).pathname.slice(1)
            return s3.copyObject({
                Bucket: config.AWS_S3_REVIEWS_BUCKET_NAME,
                CopySource: `${config.AWS_S3_REVIEWS_BUCKET_NAME}/${pathInBucket}`,
                Key: `${documentUuid}/${pathInBucket}`
            })
        }))
        await Promise.all(imageUrls.map((imageUrl) => {
            const pathInBucket = new URL(imageUrl).pathname.slice(1)
            return s3.deleteObject({
                Bucket: config.AWS_S3_REVIEWS_BUCKET_NAME,
                Key: pathInBucket
            })
        }))
        review.imageUrls = imageUrls.map((imageUrl) => {
            const pathInBucket = new URL(imageUrl).pathname.slice(1)
            return new URL(imageUrl).origin + `/${documentUuid}/${pathInBucket}`
        })
    }

    await reviewCollection().doc(documentUuid).set(review)

    return {
        id: documentUuid
    }
})
