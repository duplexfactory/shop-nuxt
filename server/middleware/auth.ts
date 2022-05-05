import {initFirebase} from "~/server/firebase/init"
import {getAuth} from "firebase-admin/auth"
import {noCache} from "~/server/util"

export default defineEventHandler(async (event) => {
    if (event.req.headers.authorization) {
        const token = event.req.headers.authorization.replace("Bearer ", "")
        initFirebase()
        const user = await getAuth().verifyIdToken(token, true)
        event.context.auth = user

        if (user) noCache(event)
    }
})
