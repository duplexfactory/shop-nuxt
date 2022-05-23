import {defineEventHandler, JSONValue} from 'h3'
import {assert} from "~/server/util"
import {notFound} from "~/utils/h3Error"
import {initMongo, pageSearchCollection} from "~/server/mongodb";

export default defineEventHandler(async (event) => {
    const {username} = event.context.params
    assert(username)

    await initMongo();
    const page = await pageSearchCollection.findOne({
        username
    })
    assert(page, notFound)

    return {
        page
    } as unknown as JSONValue
    // { page: IgPage }
})
