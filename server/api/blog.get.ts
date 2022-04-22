import {IncomingMessage, ServerResponse} from "http";
import {badRequest, noCache, notFound} from "~/server/util";
import {sendError, useQuery} from "h3";
import {blogCollection} from "~/server/firebase/collections";
import Blog from "~/models/Blog";

export default async function (req: IncomingMessage, res: ServerResponse): Promise<{ blog: Blog }> {
    noCache(res)

    const {
        id
    } = useQuery(req) as { id: string };

    if (!id) {
        throw sendError(res, badRequest);
    }

    const blogDoc = await blogCollection().doc(id).get();

    if(!blogDoc.exists) {
        sendError(res, notFound);
    }

    return {blog: blogDoc.data()};
}