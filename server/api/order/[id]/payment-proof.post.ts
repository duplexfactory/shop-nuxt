import {defineEventHandler, JSONValue, useBody} from "h3";
import {assert} from "~/server/util";
import {initMongo, orderCollection} from "~/server/mongodb";
import {ObjectId} from "mongodb";
import {PaymentMethodData, PaymentType} from "~/models/IgPageCommerceData";
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

    assert(paymentMethodData)
    if (paymentMethodData.method !== PaymentType.IN_PERSON) {
        assert(url)
    }

    await initMongo();
    const set: any = {
        [`shops.${pageId}.orderStatus`]: OrderStatus.TB_VERIFIED,
        [`shops.${pageId}.paymentMethodData`]: paymentMethodData,
    }
    if (paymentMethodData.method !== PaymentType.IN_PERSON) {
        set[`shops.${pageId}.paymentProofUrl`] = url
    }
    await orderCollection.findOneAndUpdate({
        _id: new ObjectId(id)
    }, {
        $set: set
    })

    return {
        success: true
    }
})