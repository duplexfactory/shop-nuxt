import {pageCollection} from "~/server/firebase/collections";
import {defineEventHandler, JSONValue} from 'h3'
import {assert, notFound} from "~/server/util";

export default defineEventHandler(async (event) => {
    const username = event.req.originalUrl?.split("/").pop();
    assert(event, username)

    const pageDoc = await pageCollection().where("username", "==", username).get()
    assert(event, !pageDoc.empty, notFound)

    const [page] = pageDoc.data();
    assert(event, !page.deleted, notFound)

    return {
        page
    } as unknown as JSONValue
    // { page: IgPage }
})
