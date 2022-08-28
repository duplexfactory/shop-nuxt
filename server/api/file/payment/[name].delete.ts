import {assert, getAuth, noCache} from "~/server/util";
import {defineEventHandler} from "h3";

import {DeleteObjectCommand} from "@aws-sdk/client-s3";
import {initS3, s3} from "~/server/s3";

export default defineEventHandler(async (event) => {

    noCache(event)
    const config = useRuntimeConfig();

    const {name} = event.context.params
    assert(name)

    const auth = getAuth(event)

    await initS3()
    const key = `${auth.uid}/shop/payment/${name}`
    const params = {
        Bucket: config.AWS_S3_BUCKET_NAME,
        Key: key,
    };
    await s3.send(new DeleteObjectCommand(params));

    return {
        success: true
    }
})
