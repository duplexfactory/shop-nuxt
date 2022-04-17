import {IncomingMessage, ServerResponse} from "http";
import {assertMethod, sendError, useQuery} from "h3";
import {notFound} from "~/server/util";
import {shopSuggestionCollection} from "~/server/firebase/collections";
import {initMongo, pendingPageCollection} from "~/server/mongodb";

export default async (req: IncomingMessage, res: ServerResponse) => {
    assertMethod(req, "POST")

    const {
        id
    } = useQuery(req) as { id: string };

    const ss = await shopSuggestionCollection().doc(id).get();
    if (!ss.exists) {
        sendError(res, notFound);
    }

    const suggestion = ss.data();

    await initMongo();
    await pendingPageCollection.insertOne({
        username: suggestion.username
    });

    await shopSuggestionCollection().doc(id).delete();

    return {
        success: true
    }
}