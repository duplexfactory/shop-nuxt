import {defineEventHandler} from "h3";
import {noCache} from "~/server/util";
import * as fs from "fs";
import formidable from 'formidable';
import {PaymentType} from "~/models/IgPageCommerceData";
import {PutObjectCommand} from "@aws-sdk/client-s3";
import { s3, s3Region} from "~/server/s3";

export default defineEventHandler(async (event) => {

    noCache(event)
    const config = useRuntimeConfig();

    const {
        orderId,
        pageId
    } = getQuery(event)

    const form = new formidable.IncomingForm();
    const {
        fields,
        files
    } = await new Promise(function (resolve, reject) {
        form.parse(event.req, function (err, fields, files) {
            if (err) {
                reject(err);
                return;
            }
            resolve({
                fields,
                files
            });
        }); // form.parse
    });

    const imagePath = files['image'].filepath
    const blob = fs.readFileSync(imagePath)

    const key = `${orderId}/${pageId}`
    const params = {
        Bucket: config.AWS_S3_ORDER_PROOFS_BUCKET_NAME,
        Key: key,
        Body: blob,
    };
    await s3.send(new PutObjectCommand(params));

    return {
        url: `https://${config.AWS_S3_ORDER_PROOFS_BUCKET_NAME}.s3.${s3Region}.amazonaws.com/${key}`
    }
})
