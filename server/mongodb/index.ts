import {Collection, MongoClient, MongoClientOptions} from "mongodb"
import {PageSearch} from "~/models/PageSearch"
import IgAuth from "~/models/IgAuth"
import {PendingPage} from "~/models/PendingPage"
import IgPageOverride from "~/models/IgPageOverride";

export let igAuthCollection: Collection<IgAuth>
export let pageSearchCollection: Collection<PageSearch>
export let pendingPageCollection: Collection<PendingPage>
export let pageOverrideCollection: Collection<IgPageOverride>;

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
        igAuthCollection = db.collection("igAuth")
        pageSearchCollection = db.collection("page")
        pendingPageCollection = db.collection("pendingPage");
        pageOverrideCollection = db.collection("pageOverride");
        init = true
    }
    return client
}
