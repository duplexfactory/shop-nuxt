import {defineEventHandler} from "h3";
import {getAuth, noCache} from "~/server/util";
import {igAuthCollection, initMongo} from "~/server/mongodb";

export default defineEventHandler(async (event) => {
    const auth = getAuth(event)
    await initMongo()

    const igAuth = await igAuthCollection.deleteOne({userId: auth.uid})

    return {success: true}
})
