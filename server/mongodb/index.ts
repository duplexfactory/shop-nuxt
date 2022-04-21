import {Collection, MongoClient, MongoClientOptions} from "mongodb";
import {PageSearch} from "~/models/PageSearch";
import IgAuth from "~/models/IgAuth";

export let pageSearchCollection: Collection<PageSearch>;
export let igAuthCollection: Collection<IgAuth>;
let init = false;
let client: MongoClient;

export async function initMongo() {
    if (!init) {
        client = await MongoClient.connect(useRuntimeConfig().MONGO_SRV, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        } as MongoClientOptions);
        const db = client.db(config.DEV ? "ig-dev" : "ig");
        pageSearchCollection = db.collection("page");
        igAuthCollection = db.collection("igAuth");
        init = true;
    }
    return client;
}
