import {defineEventHandler, getQuery} from "h3";
import {shopSuggestionCollection} from "~/server/firebase/collections";
import {noCache} from "~/server/util";

export default defineEventHandler(async (event) => {
    noCache(event);
    const {
        id
    } = getQuery(event) as { id: string };
    await shopSuggestionCollection().doc(id).delete();
    return {
        success: true
    };
});
