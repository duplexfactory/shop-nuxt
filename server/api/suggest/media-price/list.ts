import {IncomingMessage, ServerResponse} from "http";
import {mediaPriceSuggestionCollection} from "~/server/firebase/collections";

export default async (req: IncomingMessage, res: ServerResponse) => {
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
    }
}