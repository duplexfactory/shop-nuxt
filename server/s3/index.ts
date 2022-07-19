import {S3} from "@aws-sdk/client-s3";

export const s3Region = 'ap-east-1'
export const s3 = new S3({
    region: s3Region,
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    },
})