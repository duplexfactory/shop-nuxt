import {IncomingMessage, ServerResponse} from "http";
import {shopSuggestionCollection} from "~/server/firebase/collections";

export default async (req: IncomingMessage, res: ServerResponse) => {
    const ss = await shopSuggestionCollection()
        .orderBy("created", "desc")
        .get();

// .limit(21)
// .pick(...cardFields)

    return {
        suggestions: ss.docs.map((d) => ({
            ...d.data(),
            id: d.id
        }))
    }
}