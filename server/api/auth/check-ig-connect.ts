import {defineEventHandler} from "h3";
import {getAuth, noCache} from "~/server/util";
import {igAuthCollection, initMongo} from "~/server/mongodb";

export default defineEventHandler(async (event) => {

    noCache(event)
    const auth = getAuth(event)
    await initMongo()

    const igAuth = await igAuthCollection.findOne({
        userId: auth.uid
    })

    if (igAuth === null)
        return {
            connected: false
        };

    return {
        connected: true,
        invalid: !!igAuth.invalid,
        username: igAuth.username,
        pageId: igAuth.pageId
    }
})
