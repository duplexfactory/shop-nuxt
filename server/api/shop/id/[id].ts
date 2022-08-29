import {defineEventHandler} from "h3"
import {assert} from "~/server/util"
import {notFound} from "~/utils/h3Error"
import {initMongo, pageSearchCollection} from "~/server/mongodb";

export default defineEventHandler(async (event) => {
    const {id} = event.context.params
    assert(id)

    await initMongo();
    const page = await pageSearchCollection.findOne({
        _id: id
    })
    assert(page, notFound)

    return {
        page
    }
    // { page: IgPage }
})
