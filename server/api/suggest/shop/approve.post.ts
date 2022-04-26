import {defineEventHandler, sendError, useQuery} from "h3";
import {notFound} from "~/server/util";
import {shopSuggestionCollection} from "~/server/firebase/collections";
import {initMongo, pendingPageCollection} from "~/server/mongodb";

export default defineEventHandler(async (event) => {
    const {
        id
    } = useQuery(event) as { id: string };

    const ss = await shopSuggestionCollection().doc(id).get();
    if (!ss.exists) {
        sendError(event, notFound);
    }

    const suggestion = ss.data();

    await initMongo();
    await pendingPageCollection.insertOne({
        username: suggestion.username
    });

    await shopSuggestionCollection().doc(id).delete();

    return {
        success: true
    };
});