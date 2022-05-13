import {pageCollection} from "~/server/firebase/collections"
import {defineEventHandler, JSONValue} from 'h3'
import {assert} from "~/server/util"
import {notFound} from "~/utils/h3Error"

export default defineEventHandler(async (event) => {
    const {username} = event.context.params
    assert(username)

    const pageDoc = await pageCollection().where("username", "==", username).get()
    assert(!pageDoc.empty, notFound)

    const [page] = pageDoc.data()
    assert(!page.deleted, notFound)

    return {
        page
    } as unknown as JSONValue
    // { page: IgPage }
})
