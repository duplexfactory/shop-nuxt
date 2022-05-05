import {defineEventHandler} from "h3"
import {getAuth, noCache} from "~/server/util"

export default defineEventHandler(async (event) => {
    const auth = getAuth(event)
    return {auth}
})
