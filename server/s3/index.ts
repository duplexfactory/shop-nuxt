import {S3} from "@aws-sdk/client-s3";

export const s3Region = 'ap-east-1'

const config = useRuntimeConfig()
export const s3: S3 = new S3({
    region: s3Region,
    credentials: {
        accessKeyId: config.AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: config.AWS_S3_SECRET_ACCESS_KEY,
    },
})
