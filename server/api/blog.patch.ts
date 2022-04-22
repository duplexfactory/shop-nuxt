import {IncomingMessage, ServerResponse} from "http";
import {badRequest, noCache, notFound} from "~/server/util";
import {sendError, useBody, useQuery} from "h3";
import {blogCollection} from "~/server/firebase/collections";
import Blog from "~/models/Blog";

export default async function (req: IncomingMessage, res: ServerResponse): Promise<{ id: string }> {
    noCache(res)

    const {
        id
    } = useQuery(req) as { id: string };

    if (!id) {
        throw sendError(res, badRequest);
    }

    const {
        title,
        slug,
        metaDesc,
        htmlContent,
    } = await useBody<Partial<Omit<Blog, "id" | "created">>>(req);

    await blogCollection().doc(id).update({
        title,
        slug,
        metaDesc,
        htmlContent,
    })

    return {
        id
    }
}