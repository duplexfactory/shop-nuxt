import {defineEventHandler} from "h3"
import {getAuth} from "~/server/util"
import {igAuthCollection, initMongo, pageSearchCollection} from "~/server/mongodb"

export default defineEventHandler(async (event) => {
    const auth = getAuth(event)
    await initMongo()

    const igAuth = await igAuthCollection.findOneAndDelete({userId: auth.uid})
    // if (igAuth.value?.pageId) {
    //     initFirebase()
    //     await pageCollection().doc(igAuth.value.pageId).update({deleted: true})
    //     pageSearchCollection.deleteOne()
    // }

    return {success: true}
})
