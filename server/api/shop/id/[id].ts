import {pageCollection} from "~/server/firebase/collections"
import {defineEventHandler, JSONValue} from "h3"
import {assert} from "~/server/util"
import {notFound} from "~/utils/h3Error"

export default defineEventHandler(async (event) => {
    const {id} = event.context.params
    assert(event, id)

    const pageDoc = await pageCollection().doc(id).get()
    assert(event, pageDoc.exists, notFound)

    const page = pageDoc.data()
    assert(event, !page.deleted, notFound)

    return {
        page
    } as unknown as JSONValue
    // { page: IgPage }
})
