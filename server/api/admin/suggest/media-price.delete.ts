import {defineEventHandler, useQuery} from "h3";
import {mediaPriceSuggestionCollection} from "~/server/firebase/collections";
import {noCache} from "~/server/util";

export default defineEventHandler(async (event) => {
    noCache(event);
    const {
        id
    } = useQuery(event) as { id: string };
    await mediaPriceSuggestionCollection().doc(id).delete();
    return {
        success: true
    }
});
