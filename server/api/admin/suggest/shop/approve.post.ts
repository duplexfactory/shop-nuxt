import {defineEventHandler, sendError, getQuery} from "h3"
import {shopSuggestionCollection} from "~/server/firebase/collections"
import {initMongo, pendingPageCollection} from "~/server/mongodb"
import {notFound} from "~/utils/h3Error"
import {assert, noCache} from "~/server/util"

export default defineEventHandler(async (event) => {
    noCache(event)

    const {
        id
    } = getQuery(event) as { id: string }

    const ss = await shopSuggestionCollection().doc(id).get()
    assert(ss.exists, notFound)

    const suggestion = ss.data()

    await initMongo()
    await pendingPageCollection.insertOne({
        username: suggestion.username
    })

    await shopSuggestionCollection().doc(id).delete()

    return {
        success: true
    }
})
