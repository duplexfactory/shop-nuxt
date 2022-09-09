import {defineEventHandler} from "h3";
import {assert, sendOrderNotificationEmail} from "~/server/util";
import {igAuthCollection, initMongo, orderCollection} from "~/server/mongodb";
import {ObjectId} from "mongodb";
import {PaymentMethodData, PaymentType} from "~/models/IgPageCommerceData";
import {OrderStatus} from "~/models/Order";
import {getAuth} from "firebase-admin/auth";
import {pageTotal} from "~/utils/discountValue";

export default defineEventHandler(async (event) => {

    const {
        id
    } = event.context.params
    assert(id)

    const {
        pageId,
        url,
        paymentMethodData
    } = await readBody<{ pageId: string, url: string, paymentMethodData: PaymentMethodData }>(event)

    assert(pageId)
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
    const order = await orderCollection.findOneAndUpdate({
        _id: new ObjectId(id)
    }, {
        $set: set
    }, {
        returnDocument: "after"
    })

    // Send email notification to shop owners.
    const igAuth = await igAuthCollection.findOne({pageId})
    const userRecord = await getAuth().getUser(igAuth.userId)
    if (!!userRecord.email) {
        await sendOrderNotificationEmail(userRecord.email, id, order.value.created, order.value.shops[pageId].orderStatus, pageTotal(order.value.shops[pageId]), paymentMethodData.method)
    }

    return {
        success: true
    }
})
