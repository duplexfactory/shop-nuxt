import {assert, getAuth, noCache} from "~/server/util";
import {defineEventHandler} from "h3";

import {PaymentType} from "~/models/IgPageCommerceData";
import {PutObjectCommand} from "@aws-sdk/client-s3";
import {s3, s3Region} from "~/server/s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";

export default defineEventHandler(async (event) => {

    noCache(event)
    const config = useRuntimeConfig()

    const {
        type: typeString
    } = getQuery(event)
    const type: PaymentType = Number(typeString)
    assert([PaymentType.PAYME, PaymentType.WECHAT_PAY_HK, PaymentType.ALIPAY_HK].includes(type))

    const auth = getAuth(event)

    const dict = {
        [PaymentType.PAYME]: "PayMe",
        [PaymentType.WECHAT_PAY_HK]: "WeChat_Pay_HK",
        [PaymentType.ALIPAY_HK]: "AlipayHK",
    }

    const key = `${auth.uid}/shop/payment/${dict[type]}-${Date.now()}`
    const params = {
        Bucket: config.AWS_S3_BUCKET_NAME,
        Key: key,
    }

    const signedUrl = await getSignedUrl(s3, new PutObjectCommand(params), {
        expiresIn: 3600,
    })

    return {
        url: `https://${config.AWS_S3_BUCKET_NAME}.s3.${s3Region}.amazonaws.com/${key}`,
        signedUrl
    }
})
