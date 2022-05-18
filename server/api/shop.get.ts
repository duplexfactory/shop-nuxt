import {defineEventHandler, JSONValue, sendError, useQuery} from "h3"
import {notFound} from "~/utils/h3Error"
import {assert, guard} from "~/server/util"
import {PageSearch} from "~/models/PageSearch";
import {pageSearchCollection} from "~/server/mongodb";

export default defineEventHandler(async (event) => {
    const {id, username} = await useQuery(event) as { id: string | undefined, username: string | undefined }

    let page: PageSearch | null;
    if (!!id) {
        page = await pageSearchCollection.findOne({_id: id});
    } else {
        page = await pageSearchCollection.findOne({username});
    }

    assert(page, notFound);

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
    } as unknown as JSONValue
    // { page: IgPage }
})
