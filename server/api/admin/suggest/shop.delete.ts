import {defineEventHandler, useQuery} from "h3";
import {shopSuggestionCollection} from "~/server/firebase/collections";

export default defineEventHandler(async (event) => {
    const {
        id
    } = useQuery(event) as { id: string };
    await shopSuggestionCollection().doc(id).delete();
    return {
        success: true
    };
});