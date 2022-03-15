import {pageCollection} from "~/server/firebase/collections";
import IgPage from "~/models/IgPage";
import {fields} from "~/server/firebase/init";
import {IncomingMessage, ServerResponse} from "http";
import {useQuery} from "h3";
import {Query, DocumentData} from "@google-cloud/firestore";

export default async (req: IncomingMessage, res: ServerResponse): Promise<{ pages: {username: string}[] }> => {

    let q: Query<DocumentData> = pageCollection()
        .where("deleted", "==", false)
        .where("private", "==", false);

    const [pages] = await Promise.all([
        q
            .pick("username")
            .get()
            .then(ss => ss.data()),
    ])

    return {
        pages
    };
}
