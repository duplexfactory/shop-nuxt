import {badRequest, noCache} from "~/server/util";
import {defineEventHandler, sendError, useBody, useQuery} from "h3";
import {blogCollection} from "~/server/firebase/collections";
import Blog from "~/models/Blog";

export default defineEventHandler(async (event) => {
    noCache(event)

    const {
        id
    } = useQuery(event) as { id: string };

    if (!id) {
        throw sendError(event, badRequest);
    }

    const {
        title,
        slug,
        metaDesc,
        htmlContent,
    } = await useBody<Partial<Omit<Blog, "id" | "created">>>(event);

    await blogCollection().doc(id).update({
        title,
        slug,
        metaDesc,
        htmlContent,
    })

    return {
        id
    }
})