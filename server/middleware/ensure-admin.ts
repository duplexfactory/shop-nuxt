import {sendError, useCookies} from "h3";
import {notFound} from "~/utils/h3Error";

export default defineEventHandler((event) => {
    if (event.req.url.startsWith('/admin') || event.req.url.startsWith('/api/admin')) {
        const cookies = useCookies(event);
        const cookie = cookies["duplex_factory"];
        if (!cookie || cookie !== "shoperuse_is_great") {
            sendError(event, notFound);
        }
    }
})