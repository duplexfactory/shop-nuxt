import type {IncomingMessage, ServerResponse} from 'http'
import {pageCollection} from "~/server/firebase/collections";
import {sendError, useQuery} from 'h3'
import type IgPage from "~/models/IgPage";
import {DocumentSnapshot, QuerySnapshot} from "@google-cloud/firestore";
import {notFound} from "~/server/util";

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
        throw sendError(res, notFound)
    }

    const data = pageDoc.data();
    let page: IgPage;
    if (data instanceof Array) {
        if (data.length !== 0) {
            page = data[0]
        }
        else {
            throw sendError(res, notFound)
        }
    }
    else {
        page = data;
    }

    if (page.deleted) {
        throw sendError(res, notFound)
    }

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
