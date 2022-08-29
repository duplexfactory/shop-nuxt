import {defineEventHandler, sendError, getQuery} from "h3";
import {initDynamo, patchMediaByCode} from "~/server/dynamodb";
import {mediaPriceSuggestionCollection} from "~/server/firebase/collections";
import {notFound} from "~/utils/h3Error";
import {assert, noCache} from "~/server/util"

export default defineEventHandler(async (event) => {
    noCache(event);

    const {
        id
    } = getQuery(event) as { id: string };

    const ss = await mediaPriceSuggestionCollection().doc(id).get();
    assert(ss.exists, notFound);

    const suggestion = ss.data();

    initDynamo();
    const success = await patchMediaByCode(suggestion.code, {
        patchPrice: suggestion.price
    });
    assert(success, notFound);

    await mediaPriceSuggestionCollection().doc(id).delete();

    return {
        success: true
    }
});
