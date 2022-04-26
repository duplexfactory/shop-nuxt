import {noCache} from "~/server/util";
import {defineEventHandler, JSONValue, sendError, useQuery} from "h3";
import {blogCollection} from "~/server/firebase/collections";
import Blog from "~/models/Blog";
import {badRequest, notFound} from "~/utils/h3Error";

export default defineEventHandler(async (event) => {
    noCache(event)

    const {
        id
    } = useQuery(event) as { id: string };

    if (!id) {
        throw sendError(event, badRequest);
    }

    const blogDoc = await blogCollection().doc(id).get();

    if(!blogDoc.exists) {
        sendError(event, notFound);
    }

    return {blog: blogDoc.data()} as unknown as JSONValue;

    // { blog: Blog }
})