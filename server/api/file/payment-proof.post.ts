import {defineEventHandler} from "h3";
import {noCache} from "~/server/util";
import {PutObjectCommand} from "@aws-sdk/client-s3";
import {s3, s3Region} from "~/server/s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner"

export default defineEventHandler(async (event) => {

    noCache(event)
    const config = useRuntimeConfig()

    const {
        orderId,
        pageId
    } = getQuery(event)

    const key = `${orderId}/${pageId}`
    const params = {
        Bucket: config.AWS_S3_ORDER_PROOFS_BUCKET_NAME,
        Key: key,
    }

    const signedUrl = await getSignedUrl(s3, new PutObjectCommand(params), {
        expiresIn: 3600,
    })

    return {
        url: `https://${config.AWS_S3_ORDER_PROOFS_BUCKET_NAME}.s3.${s3Region}.amazonaws.com/${key}`,
        signedUrl
    }
})
