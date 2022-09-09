import {defineEventHandler} from "h3"
import {noCache} from "~/server/util"

import * as fs from "fs"
import formidable from 'formidable'
import {s3, s3Region} from "~/server/s3"
import {PutObjectCommand} from "@aws-sdk/client-s3"

export default defineEventHandler(async (event) => {

    noCache(event)
    const config = useRuntimeConfig()

    const form = new formidable.IncomingForm()
    const {
        fields,
        files
    } = await new Promise<{ fields, files }>(function (resolve, reject) {
        form.parse(event.req, function (err, fields, files) {
            if (err) {
                reject(err)
                return
            }
            resolve({
                fields,
                files
            })
        }) // form.parse
    })



    const imagePaths = Object.keys(files).map((i) => files[i].filepath)
    const paramsList = imagePaths.map((p) => {
        const blob = fs.readFileSync(p)
        return {
            Bucket: config.AWS_S3_REVIEWS_BUCKET_NAME,
            Key: `${Date.now()}`,
            Body: blob,
        }
    })
    await Promise.all(paramsList.map((params) => s3.send(new PutObjectCommand(params))))

    return {
        urls: paramsList.map((params) => `https://${config.AWS_S3_REVIEWS_BUCKET_NAME}.s3.${s3Region}.amazonaws.com/${params.Key}`)
    }
})
