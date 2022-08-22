import {defineEventHandler, JSONValue, useBody} from "h3";
import {assert, getAuth} from "~/server/util";
import {igAuthCollection, initMongo, orderCollection} from "~/server/mongodb";
import {notFound} from "~/utils/h3Error";
import {ObjectId} from "mongodb";
import {OrderStatus} from "~/models/Order";

export default defineEventHandler(async (event) => {

    const {id} = event.context.params
    assert(id)

    const {
        status
    } = await useBody<{
        status: OrderStatus
    }>(event);
    assert(status)

    const auth = getAuth(event)
    await initMongo();
    const igAuth = await igAuthCollection.findOne({
        userId: auth.uid
    })
    assert(igAuth, notFound)

    const set: any = {
        [`shops.${igAuth.pageId}.orderStatus`]: status
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
