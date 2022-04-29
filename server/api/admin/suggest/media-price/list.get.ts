import {mediaPriceSuggestionCollection} from "~/server/firebase/collections";
import {defineEventHandler, JSONValue} from "h3";
import {noCache} from "~/server/util";

export default defineEventHandler(async (event) => {

    noCache(event);

    const ss = await mediaPriceSuggestionCollection()
        .orderBy("created", "desc")
        .get();

// .limit(21)
// .pick(...cardFields)

    return {
        suggestions: ss.docs.map((d) => ({
            ...d.data(),
            id: d.id
        }))
    } as unknown as JSONValue;
})
