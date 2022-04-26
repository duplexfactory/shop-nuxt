import {pageCollection} from "~/server/firebase/collections"
import {defineEventHandler, JSONValue} from 'h3'
import {assert} from "~/server/util"
import {notFound} from "~/utils/h3Error"

export default defineEventHandler(async (event) => {
    const {username} = event.context.params
    assert(event, username)

    const pageDoc = await pageCollection().where("username", "==", username).get()
    assert(event, !pageDoc.empty, notFound)

    const [page] = pageDoc.data()
    assert(event, !page.deleted, notFound)

    return {
        page
    } as unknown as JSONValue
    // { page: IgPage }
})
