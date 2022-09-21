import {blogCollection, pageCollection} from "~/server/firebase/collections"
import {IncomingMessage, ServerResponse} from "http";
import {Query, DocumentData} from "@google-cloud/firestore";

export default async (req: IncomingMessage, res: ServerResponse) => {

    let q: Query<DocumentData> = pageCollection()
        .where("deleted", "==", false)
        .where("private", "==", false);

    const [pages, blogs] = await Promise.all([
        q
            .pick("username")
            .get()
            .then(ss => ss.data()),
        blogCollection().pick("slug", "id").get().then(ss => ss.data())
    ])

    return {
        routes: blogs.map((b) => `/blog/${b.slug}-${b.id}`).concat(pages.map((p) => `/shop/${p.username}`))
    };
}
