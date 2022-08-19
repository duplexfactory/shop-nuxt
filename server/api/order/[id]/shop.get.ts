import {defineEventHandler, JSONValue} from "h3";
import {igAuthCollection, initMongo, orderCollection} from "~/server/mongodb";
import {assert, getAuth} from "~/server/util";
import {ObjectId} from "mongodb";
import {notFound} from "~/utils/h3Error";

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

    return {
        order
    } as unknown as JSONValue
})
