import {IncomingMessage, ServerResponse} from "http";
import {initMongo, pageSearchCollection} from "~/server/mongodb";

export default async (req: IncomingMessage, res: ServerResponse): Promise<{ pages: {username: string}[] }> => {
    await initMongo();
    const pages = await pageSearchCollection.find().project<{username: string}>({username: 1}).toArray();
    return {
        pages
    };
}
