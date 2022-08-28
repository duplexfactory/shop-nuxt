import {S3} from "@aws-sdk/client-s3";

export const s3Region = 'ap-east-1'

let init = false
export let s3: S3

export async function initS3() {
    if (!init) {
        const config = useRuntimeConfig()
        s3 = new S3({
            region: s3Region,
            credentials: {
                accessKeyId: config.AWS_S3_ACCESS_KEY_ID,
                secretAccessKey: config.AWS_S3_SECRET_ACCESS_KEY,
            },
        })
        init = true
    }
    return s3
}

