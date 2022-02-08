import config from "#config";
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
// import {marshall, unmarshall} from "@aws-sdk/util-dynamodb";

let init = false;
let client: DynamoDBClient;

export async function initDynamo() {
    if (!init) {
        client = new DynamoDBClient({
            credentials: {
                accessKeyId: config.DYNAMODB_ACCESS_KEY_ID,
                secretAccessKey: config.DYNAMODB_SECRET_ACCESS_KEY
            },
            region: config.DYNAMODB_REGION
        });
        init = true;
    }
    return client;
}
