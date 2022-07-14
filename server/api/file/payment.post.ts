import {assert, getAuth, noCache} from "~/server/util";
import {defineEventHandler} from "h3";
import {initMongo} from "~/server/mongodb";

import * as fs from "fs";
import formidable from 'formidable';
import {PaymentType} from "~/models/IgPageCommerceData";
import {PutObjectCommand, S3} from "@aws-sdk/client-s3";

export default defineEventHandler(async (event) => {

    noCache(event)

    const {
        type: typeString
    } = useQuery(event)
    const type: PaymentType = Number(typeString)
    assert([PaymentType.PAYME, PaymentType.WECHAT_PAY_HK, PaymentType.ALIPAY_HK].includes(type))

    const auth = getAuth(event)
    await initMongo()

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

    const region = 'ap-east-1'
    const s3 = new S3({
        region,
        credentials: {
            accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
        },
    })

    const dict = {
        [PaymentType.PAYME]: "PayMe",
        [PaymentType.WECHAT_PAY_HK]: "WeChat_Pay_HK",
        [PaymentType.ALIPAY_HK]: "AlipayHK",
    }

    const key = `${auth.uid}/shop/payment/${dict[type]}`
    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
        Body: blob,
    };
    await s3.send(new PutObjectCommand(params));

    return {
        url: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${region}.amazonaws.com/${key}`
    }
})