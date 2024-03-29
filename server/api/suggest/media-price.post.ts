import {defineEventHandler} from "h3";
import {mediaPriceSuggestionCollection} from "~/server/firebase/collections";

export default defineEventHandler(async (event) => {
    const {
        code,
        price
    } = await readBody<{ code: string, price: number}>(event);
    const suggestion = {
        code,
        price,
        created: Date.now(),
    };

    const reference = await mediaPriceSuggestionCollection().add(suggestion);
    return {
        id: reference.id
    }
});
