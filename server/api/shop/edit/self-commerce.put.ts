import {defineEventHandler} from "h3";
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
    } = await readBody<Partial<Omit<IgPageCommerceData, "_id">>>(event)

    const set = {
        discount,
        mailingDiscount,
        mailing,
        paymentMethodData
    }
    let defaults = {
        mailing: [],
        paymentMethodData: []
    }
    for (const key of Object.keys(set)) {
        if (set[key] === undefined) {
            delete set[key]
        }
        else {
            delete defaults[key]
        }
    }

    // Upsert override data.
    await pageCommerceDataCollection.updateOne({
        _id: igAuth.pageId
    }, {
        $set: set,
        $setOnInsert: defaults
    }, {upsert: true})

    return {
        success: true
    }
})
