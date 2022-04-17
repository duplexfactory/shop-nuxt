import {IncomingMessage, ServerResponse} from "http";
import {assertMethod, isMethod, useBody, useQuery} from "h3";
import {shopSuggestionCollection} from "~/server/firebase/collections";

export default async (req: IncomingMessage, res: ServerResponse) => {
    assertMethod(req, ["POST", "DELETE"])

    if (isMethod(req, "POST")) {
        const {
            username
        } = await useBody<{ username: string }>(req);
        const suggestion = {
            username,
            created: Date.now(),
        };

        const reference = await shopSuggestionCollection().add(suggestion);
        return {
            id: reference.id
        }
    }

    if (isMethod(req, "DELETE")) {
        const {
            id
        } = useQuery(req) as { id: string };
        await shopSuggestionCollection().doc(id).delete();
        return {
            success: true
        }
    }


}