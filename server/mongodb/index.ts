import {Collection, MongoClient, MongoClientOptions} from "mongodb"
import {PageSearch} from "~/models/PageSearch"
import IgAuth from "~/models/IgAuth"
import {PendingPage} from "~/models/PendingPage"

export let pageSearchCollection: Collection<PageSearch>
export let igAuthCollection: Collection<IgAuth>
export let pendingPageCollection: Collection<PendingPage>

const config = useRuntimeConfig()

let init = false
let client: MongoClient

export async function initMongo() {
    if (!init) {
        client = await MongoClient.connect(config.MONGO_SRV, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        } as MongoClientOptions)
        const db = client.db(config.DEV_DB ? "ig-dev" : "ig")
        pageSearchCollection = db.collection("page")
        igAuthCollection = db.collection("igAuth")
        pendingPageCollection = db.collection("pendingPage")
        init = true
    }
    return client
}
