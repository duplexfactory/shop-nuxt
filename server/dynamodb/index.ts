import config from "#config";
import {DynamoDBClient, QueryCommand} from "@aws-sdk/client-dynamodb";
import {marshall, unmarshall} from "@aws-sdk/util-dynamodb";
import IgMedia from "~/models/IgMedia";
import dayjs from "dayjs";
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

export async function getPageMedias(pagePk: number, limit?: number, before = dayjs().unix()) {
    const res = await client.send(new QueryCommand({
        TableName: "medias",
        KeyConditionExpression: "pagePk = :pagePk AND takenAt < :before",
        ExpressionAttributeValues: marshall({":pagePk": pagePk, ":before": before}),
        ScanIndexForward: false,
        Limit: limit
    }));

    return res.Items?.map(m => unmarshall(m)) as IgMedia[];
}
