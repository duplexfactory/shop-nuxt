import {defineEventHandler, useBody} from "h3";
import {assert, getAuth, noCache} from "~/server/util";
import {
    igAuthCollection,
    initMongo,
    pageCommerceDataCollection,
} from "~/server/mongodb";
import {notFound} from "~/utils/h3Error";
import {IgPageCommerceData} from "~/models/IgPageCommerceData";

export default defineEventHandler(async (event) => {
    noCache(event)
    const auth = getAuth(event)
    await initMongo()

    const igAuth = await igAuthCollection.findOne({
        userId: auth.uid
    })

    assert(igAuth, notFound)

    const {
        discount,
        mailingDiscount,
        mailing,
        paymentMethodData,
    } = await useBody<Partial<Omit<IgPageCommerceData, "_id">>>(event)

    const updateData = {
        discount,
        mailingDiscount,
        mailing: mailing ?? [],
        paymentMethodData: paymentMethodData ?? [],
    }
    // Remove empty fields.
    Object.keys(updateData).forEach((k) => {
        if (updateData[k] === undefined)
            delete updateData[k]
    })

    // Upsert override data.
    await pageCommerceDataCollection.updateOne({
        _id: igAuth.pageId
    }, {
        $set: updateData
    }, {upsert: true})

    return {
        success: true
    }
})