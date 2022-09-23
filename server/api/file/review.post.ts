import {defineEventHandler} from "h3"
import {assert, guard, noCache} from "~/server/util"

import * as fs from "fs"
import formidable from 'formidable'
import {s3, s3Region} from "~/server/s3"
import {PutObjectCommand} from "@aws-sdk/client-s3"
import {getSignedUrl} from "@aws-sdk/s3-request-presigner"

export default defineEventHandler(async (event) => {

    noCache(event)
    const config = useRuntimeConfig()

    const {
        imageCount
    } = getQuery(event)

    assert(imageCount)
    guard(isNaN(Number(imageCount)))

    const paramsList = Array(Number(imageCount)).fill(0).map((_, i) => ({
        Bucket: config.AWS_S3_REVIEWS_BUCKET_NAME,
        Key: `${Date.now()}-${i}`,
    }))
    const signedUrls = await Promise.all(
        paramsList.map((params) =>
            getSignedUrl(s3, new PutObjectCommand(params), {expiresIn: 3600,})
        )
    )

    return {
        urls: paramsList.map((params) => `https://${config.AWS_S3_REVIEWS_BUCKET_NAME}.s3.${s3Region}.amazonaws.com/${params.Key}`),
        signedUrls
    }
})
