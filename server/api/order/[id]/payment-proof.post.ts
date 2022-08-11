import {defineEventHandler, JSONValue, useBody} from "h3";
import {assert} from "~/server/util";
import {initMongo, orderCollection} from "~/server/mongodb";
import {ObjectId} from "mongodb";
import {PaymentMethodData} from "~/models/IgPageCommerceData";
import {OrderStatus} from "~/models/Order";

export default defineEventHandler(async (event) => {

    const {
        id
    } = event.context.params
    assert(id)

    const {
        pageId,
        url,
        paymentMethodData
    } = await useBody<{ pageId: string, url: string, paymentMethodData: PaymentMethodData }>(event)
    assert(url)
    assert(paymentMethodData)

    await initMongo();
    await orderCollection.findOneAndUpdate({
        _id: new ObjectId(id)
    }, {
        $set: {
            [`shops.${pageId}.orderStatus`]: OrderStatus.TB_VERIFIED,
            [`shops.${pageId}.paymentProofUrl`]: url,
            [`shops.${pageId}.paymentMethodData`]: paymentMethodData,
        }
    })

    return {
        success: true
    }
})