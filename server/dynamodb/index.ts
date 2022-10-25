import {
    BatchGetItemCommand,
    BatchWriteItemCommand,
    DynamoDBClient,
    GetItemCommand,
    QueryCommand,
    UpdateItemCommand
} from "@aws-sdk/client-dynamodb"
import {marshall, unmarshall} from "@aws-sdk/util-dynamodb"
import IgMedia from "~/models/IgMedia"
import dayjs from "dayjs"
// import {marshall, unmarshall} from "@aws-sdk/util-dynamodb";

let init = false
let client: DynamoDBClient

export async function initDynamo() {
    if (!init) {
        const config = useRuntimeConfig()
        client = new DynamoDBClient({
            credentials: {
                accessKeyId: config.DYNAMODB_ACCESS_KEY_ID,
                secretAccessKey: config.DYNAMODB_SECRET_ACCESS_KEY
            },
            region: config.DYNAMODB_REGION
        })
        init = true
    }
    return client
}

export async function getPageMedias(pageId: string, limit?: number, until?: number, since?: number, before?: string, after?: string) {

    let keyCondition = ""
    let expressionAttributeValues
    if (since !== undefined && until === undefined) {
        keyCondition = "pageId = :pageId AND takenAt > :since"
        expressionAttributeValues = marshall({":pageId": pageId, ":since": since})
    }
    else if (since !== undefined && until !== undefined) {
        keyCondition = "pageId = :pageId AND takenAt > :since AND takenAt < :before"
        expressionAttributeValues = marshall({":pageId": pageId, ":before": until, ":since": since})
    }
    else {
        // until !== undefined && since === undefined
        // until === undefined && since === undefined
        keyCondition = "pageId = :pageId AND takenAt < :before"
        expressionAttributeValues = marshall({":pageId": pageId, ":before": until || dayjs().unix()})
    }

    const res = await client.send(new QueryCommand({
        TableName: "media",
        KeyConditionExpression: keyCondition,
        ExpressionAttributeValues: expressionAttributeValues,
        ScanIndexForward: false,
        Limit: limit
    }))
    return res.Items?.map(m => unmarshall(m)) as IgMedia[]
}

export async function getMedia(pageId: number, takenAt: number): Promise<IgMedia | null> {
    const res = await client.send(new GetItemCommand({
        TableName: "media",
        Key: marshall({pageId, takenAt})
    }))
    return res.Item ? unmarshall(res.Item) as IgMedia : null
}

export async function patchMedia(pageId: string, takenAt: number, patchItem): Promise<void> {
    await update("media", {
        pageId, takenAt
    }, patchItem)
}

async function queryMediaByCode(code: string) {
    return client.send(new QueryCommand({
        TableName: "media",
        IndexName: "code-index",
        KeyConditionExpression: "code = :code",
        ExpressionAttributeValues: marshall({":code": code}),
        ScanIndexForward: false,
        Limit: 1
    }))
}

export async function getMediaByCode(code: string): Promise<IgMedia | null> {
    const res = await queryMediaByCode(code)
    if (res?.Count) {
        const {pageId, takenAt} = unmarshall(res.Items[0])
        return getMedia(pageId, takenAt)
    } else return undefined
}

export async function getMediasByCodes(codes: string[]): Promise<IgMedia[]> {
    const keys = (await Promise.all(codes.map(async (code) => {
        const res = await queryMediaByCode(code)
        if (res?.Count) {
            const {
                pageId,
                takenAt
            } = unmarshall(res.Items[0]) as {pageId: number, takenAt: number}
            return {pageId, takenAt}
        }
        return null
    }))).filter((k) => k !== null)

    const res = await client.send(new BatchGetItemCommand({
        RequestItems: {
            "media": {
                Keys: keys.map((k) => marshall({pageId: k.pageId, takenAt: k.takenAt}))
            }
        },
    }))

    return res.Responses && res.Responses["media"] ? res.Responses["media"].map((i) => unmarshall(i) as IgMedia) : []
}

export async function patchMediaByCode(code: string, patchItem): Promise<boolean> {
    const res = await queryMediaByCode(code)
    if (res?.Count) {
        const {pageId, takenAt} = unmarshall(res.Items[0])
        await patchMedia(pageId, takenAt, patchItem)
        return true
    } else {
        return false
    }
}

/**
 * Update item in DynamoDB table
 * @param {string} tableName // Name of the target table
 * @param {object} key // Object containing target item key(s)
 * @param {object} item // Object containing updates for target item
 */
const update = async (tableName, key, item) => {
    const itemKeys = Object.keys(item)

    // When we do updates we need to tell DynamoDB what fields we want updated.
    // If that's not annoying enough, we also need to be careful as some field names
    // are reserved - so DynamoDB won't like them in the UpdateExpressions list.
    // To avoid passing reserved words we prefix each field with "#field" and provide the correct
    // field mapping in ExpressionAttributeNames. The same has to be done with the actual
    // value as well. They are prefixed with ":value" and mapped in ExpressionAttributeValues
    // along with their actual value
    const {Attributes} = await client.send(new UpdateItemCommand({
        TableName: tableName,
        Key: marshall(key),
        ReturnValues: "ALL_NEW",
        UpdateExpression: `SET ${itemKeys.map((k, index) => `#field${index} = :value${index}`).join(", ")}`,
        ExpressionAttributeNames: itemKeys.reduce((accumulator, k, index) => ({
            ...accumulator,
            [`#field${index}`]: k
        }), {}),
        ExpressionAttributeValues: marshall(itemKeys.reduce((accumulator, k, index) => ({
            ...accumulator,
            [`:value${index}`]: item[k]
        }), {})),
    }))

    return unmarshall(Attributes)
}

export async function saveMedias(medias: IgMedia[]) {
    await client.send(new BatchWriteItemCommand({
        RequestItems: {media: medias.map(media => ({PutRequest: {Item: marshall(media)}}))}
    }));
}
