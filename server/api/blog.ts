import {IncomingMessage, ServerResponse} from "http";
import {noCache} from "~/server/util";
import {assertMethod, useBody} from "h3";
import {blogCollection} from "~/server/firebase/collections";
import Blog from "~/models/Blog";

export default async function (req: IncomingMessage, res: ServerResponse): Promise<{ id: string }> {
    noCache(res)
    assertMethod(req, "POST")

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
        created: Date.now(),
        title,
        slug,
        metaDesc,
        htmlContent,
    }, {merge: true})

    return {
        id: blogId
    }
}