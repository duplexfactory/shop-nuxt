import {assert, getAuth, noCache} from "~/server/util";
import {defineEventHandler} from "h3";

import {DeleteObjectCommand} from "@aws-sdk/client-s3";
import {s3} from "~/server/s3";

export default defineEventHandler(async (event) => {

    noCache(event)

    const {name} = event.context.params
    assert(name)

    const auth = getAuth(event)

    const key = `${auth.uid}/shop/payment/${name}`
    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
    };
    await s3.send(new DeleteObjectCommand(params));

    return {
        success: true
    }
})
