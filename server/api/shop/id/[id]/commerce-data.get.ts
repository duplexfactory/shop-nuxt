import {defineEventHandler} from "h3";
import {assert} from "~/server/util";
import {initMongo, pageCommerceDataCollection, pageSearchCollection} from "~/server/mongodb";
import {notFound} from "~/utils/h3Error";

export default defineEventHandler(async (event) => {
    const {id} = event.context.params
    assert(id)

    await initMongo();
    const commerceData = await pageCommerceDataCollection.findOne({
        _id: id
    })
    assert(commerceData, notFound)

    return {
        commerceData
    }
    // { page: IgPage }
})
