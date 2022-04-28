import {reviewCollection} from "~/server/firebase/collections";
import IgPageReview from "~/models/IgPageReview";
import {defineEventHandler, JSONValue, sendError, useQuery} from 'h3';
import {QuerySnapshot} from "firebase-admin/firestore";
import {badRequest} from "~/utils/h3Error";

export default defineEventHandler(async (event) => {
    const {pageId, mediaCode} = await useQuery(event) as { pageId: string | undefined, mediaCode: string | undefined };

    let reviewSS: QuerySnapshot<IgPageReview>;
    if (mediaCode != undefined) {
        reviewSS = await reviewCollection()
            .where("mediaCode", "==", mediaCode)
            .where("deleted", "==", false)
            .orderBy("created", "desc")
            .get();
    }
    else if (pageId != undefined) {
        reviewSS = await reviewCollection()
            .where("pageId", "==", Number(pageId))
            .where("deleted", "==", false)
            .orderBy("created", "desc")
            .get();
    }
    else {
        throw sendError(event, badRequest)
    }

    const reviews = reviewSS.docs.map((d) => ({
        ...d.data(),
        id: d.id
    }))

// .limit(21)
// .pick(...cardFields)

    return {
        reviews
    } as unknown as JSONValue
    // (IgPageReview & {id: string}) []
})
