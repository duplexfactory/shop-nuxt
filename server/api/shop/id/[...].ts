import {pageCollection} from "~/server/firebase/collections";
import {defineEventHandler, JSONValue} from 'h3'
import {assert, notFound} from "~/server/util";

export default defineEventHandler(async (event) => {
    const id = event.req.originalUrl?.split("/").pop();
    assert(event, id)

    const pageDoc = await pageCollection().doc(id).get()
    assert(event, pageDoc.exists, notFound)

    const page = pageDoc.data();
    assert(event, !page.deleted, notFound)

    return {
        page
    } as unknown as JSONValue
    // { page: IgPage }
})
