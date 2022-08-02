import {defineEventHandler, JSONValue} from "h3";
import {initMongo, orderCollection} from "~/server/mongodb";
import {assert} from "~/server/util";
import {ObjectId} from "mongodb";

export default defineEventHandler(async (event) => {

    const {id} = event.context.params
    assert(id)

    await initMongo();
    const order = await orderCollection.findOne({
        _id: new ObjectId(id)
    })

    return {
        order
    } as unknown as JSONValue
})
