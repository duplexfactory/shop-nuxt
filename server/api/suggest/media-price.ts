import {IncomingMessage, ServerResponse} from "http";
import {assertMethod, isMethod, useBody, useQuery} from "h3";
import {mediaPriceSuggestionCollection} from "~/server/firebase/collections";

export default async (req: IncomingMessage, res: ServerResponse) => {
    assertMethod(req, ["POST", "DELETE"])

    if (isMethod(req, "POST")) {
        const {
            code,
            price
        } = await useBody<{ code: string, price: number}>(req);
        const suggestion = {
            code,
            price,
            created: Date.now(),
        };

        const reference = await mediaPriceSuggestionCollection().add(suggestion);
        return {
            id: reference.id
        }
    }

    if (isMethod(req, "DELETE")) {
        const {
            id
        } = useQuery(req) as { id: string };
        await mediaPriceSuggestionCollection().doc(id).delete();
        return {
            success: true
        }
    }


}