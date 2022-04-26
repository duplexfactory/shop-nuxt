import {defineEventHandler, sendError, useQuery} from "h3";
import {initDynamo, patchMediaByCode} from "~/server/dynamodb";
import {notFound} from "~/server/util";
import {mediaPriceSuggestionCollection} from "~/server/firebase/collections";

export default defineEventHandler(async (event) => {
    const {
        id
    } = useQuery(event) as { id: string };

    const ss = await mediaPriceSuggestionCollection().doc(id).get();
    if (!ss.exists) {
        sendError(event, notFound);
    }

    const suggestion = ss.data();

    initDynamo();
    const success = await patchMediaByCode(suggestion.code, {
        patchPrice: suggestion.price
    });
    if (!success) {
        sendError(event, notFound);
    }

    await mediaPriceSuggestionCollection().doc(id).delete();

    return {
        success: true
    }
});