import {defineEventHandler, JSONValue, useBody} from "h3";
import {assert, getAuth, noCache} from "~/server/util";
import IgPage from "~/models/IgPage";
import {igAuthCollection} from "~/server/mongodb";
import {notFound} from "~/utils/h3Error";
import {pageCollection} from "~/server/firebase/collections";

export default defineEventHandler(async (event) => {
    noCache(event)
    const auth = getAuth(event)

    const igAuth = await igAuthCollection.findOne({
        userId: auth.uid
    })

    assert(event, igAuth, notFound)

    await pageCollection().doc(igAuth.pageId).get()

    const {
        username,
        fullName,
        biography,
        tags
    } = await useBody<Pick<IgPage, "username" | "fullName" | "biography" | "tags">>(event)

    return {
        success: true
    }
})