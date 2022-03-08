import type {IncomingMessage, ServerResponse} from 'http'
import {pageCollection} from "~/server/firebase/collections";
import {useQuery} from 'h3'
import type IgPage from "~/models/IgPage";
import {DocumentSnapshot, QuerySnapshot} from "@google-cloud/firestore";

export default async function (req: IncomingMessage, res: ServerResponse): Promise<{ page: IgPage }> {
    const {id, username} = await useQuery(req) as { id: string | undefined, username: string | undefined }

    let pageDoc: DocumentSnapshot<IgPage> | QuerySnapshot<IgPage>;
    let exists: boolean;
    if (!!id) {
        pageDoc = await pageCollection().doc(id).get();
        exists = pageDoc.exists;
    }
    else {
        pageDoc = await pageCollection().where("username", "==", username).get()
        exists = !pageDoc.empty;
    }

    if (!exists) {
        res.statusCode = 404
        res.end()
        throw new Error()
    }

    const data = pageDoc.data();
    let page: IgPage = data instanceof Array ? data.at(0) : data;

    // const now = Date.now()
    // if (now - page.profilePicLastFetch > 2 * 24 * 60 * 60 * 1000) {
    //     const aResult: any = await $fetch(`https://www.instagram.com/${page.username}/?__a=1`, { method: 'GET'});
    //     if (aResult["graphql"] == undefined) {
    //         // Blocked by IG.
    //         throw new Error()
    //     }
    //     console.log(aResult["graphql"]["user"]["profile_pic_url"]);
    //
    //     // const writeResult = await pageCollection().doc(id).update({
    //     //     profilePicLastFetch: now,
    //     //     profilePicUrl
    //     // });
    // }

    return {
        page
    }
}
