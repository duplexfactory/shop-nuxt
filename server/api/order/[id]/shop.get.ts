import {defineEventHandler} from "h3";
import {igAuthCollection, initMongo, orderCollection} from "~/server/mongodb";
import {assert, getAuth} from "~/server/util";
import {ObjectId} from "mongodb";
import {notFound} from "~/utils/h3Error";
import {s3, s3Region} from "~/server/s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import {DeleteObjectCommand, GetObjectCommand} from "@aws-sdk/client-s3";

const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {

    const {id} = event.context.params
    assert(id)

    const auth = getAuth(event)
    await initMongo();
    const igAuth = await igAuthCollection.findOne({
        userId: auth.uid
    })
    assert(igAuth, notFound)

    const order = await orderCollection.findOne({
        _id: new ObjectId(id),
        [`shops.${igAuth.pageId}`]: {$exists: true}
    }, {
        projection: {
            _id: true,
            created: true,
            [`shops.${igAuth.pageId}`]: true
        }
    })
    assert(order, notFound)

    if (!!order.shops[igAuth.pageId].paymentProofUrl) {
        const key = `${order._id}/${igAuth.pageId}`
        const command = new GetObjectCommand({
            Bucket: config.AWS_S3_ORDER_PROOFS_BUCKET_NAME,
            Key: key,
        });
        order.shops[igAuth.pageId].paymentProofUrl = await getSignedUrl(s3, command, {
            // Expires: signedUrlExpireSeconds
        })
    }

    return {
        order
    }
})
