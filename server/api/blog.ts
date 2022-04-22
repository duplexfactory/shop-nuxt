import {IncomingMessage, ServerResponse} from "http";
import {badRequest, noCache, notFound} from "~/server/util";
import {assertMethod, isMethod, sendError, useBody, useQuery} from "h3";
import {blogCollection} from "~/server/firebase/collections";
import Blog from "~/models/Blog";

export default async function (req: IncomingMessage, res: ServerResponse): Promise<{ id: string } | { blog: Blog }> {
    noCache(res)
    assertMethod(req, ["POST", "GET", "PATCH"])

    if (isMethod(req, "POST")) {
        const {
            title,
            slug,
            metaDesc,
            htmlContent,
        } = await useBody<Omit<Blog, "id" | "created">>(req);

        // ID
        const lastBlog = (await blogCollection().orderBy("id", "desc").pick("id").limit(1).get()).data();
        let blogId = "1";
        if (lastBlog.length !== 0) {
            blogId = (Number(lastBlog.at(0).id) + 1).toString();
        }

        await blogCollection().doc(blogId).set({
            id: blogId,
            created: Date.now(),
            title,
            slug,
            metaDesc,
            htmlContent,
        })

        return {
            id: blogId
        }
    }
    else if (isMethod(req, "PATCH")) {

    }
    else if (isMethod(req, "GET")) {
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
}