import {defineEventHandler, JSONValue, useBody} from "h3";
import {assert, getAuth, sendOrderNotificationEmail} from "~/server/util";
import {igAuthCollection, initMongo, orderCollection} from "~/server/mongodb";
import {notFound} from "~/utils/h3Error";
import {ObjectId} from "mongodb";
import {OrderStatus} from "~/models/Order";
import {PaymentType} from "~/models/IgPageCommerceData";
import {pageTotal} from "~/utils/discountValue";

export default defineEventHandler(async (event) => {

    const {id} = event.context.params
    assert(id)

    const {
        status
    } = await useBody<{
        status: OrderStatus
    }>(event);
    assert(status !== undefined && status !== null)

    const auth = getAuth(event)
    await initMongo();
    const igAuth = await igAuthCollection.findOne({
        userId: auth.uid
    })
    assert(igAuth, notFound)

    const set: any = {
        [`shops.${igAuth.pageId}.orderStatus`]: status
    }
    const order = await orderCollection.findOneAndUpdate({
        _id: new ObjectId(id)
    }, {
        $set: set
    }, {
        returnDocument: "after"
    })

    // Send email notification to shop owners.
    if (!!auth.email) {
        let paymentMethod: PaymentType | undefined
        if (!!order.value.shops[igAuth.pageId].paymentMethodData) {
            paymentMethod = order.value.shops[igAuth.pageId].paymentMethodData.method
        }
        await sendOrderNotificationEmail(auth.email, id, order.value.created, order.value.shops[igAuth.pageId].orderStatus, pageTotal(order.value.shops[igAuth.pageId]), paymentMethod)
    }

    return {
        success: true
    }
})
