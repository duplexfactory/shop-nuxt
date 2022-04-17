import {IncomingMessage, ServerResponse} from "http";
import {assertMethod, sendError, useQuery} from "h3";
import {initDynamo, patchMediaByCode} from "~/server/dynamodb";
import {notFound} from "~/server/util";
import {mediaPriceSuggestionCollection} from "~/server/firebase/collections";

export default async (req: IncomingMessage, res: ServerResponse) => {
    assertMethod(req, "POST")

    const {
        id
    } = useQuery(req) as { id: string };

    const ss = await mediaPriceSuggestionCollection().doc(id).get();
    if (!ss.exists) {
        sendError(res, notFound);
    }

    const suggestion = ss.data();

    initDynamo();
    const success = await patchMediaByCode(suggestion.code, {
        patchPrice: suggestion.price
    });
    if (!success) {
        sendError(res, notFound);
    }

    await mediaPriceSuggestionCollection().doc(id).delete();

    return {
        success: true
    }
}