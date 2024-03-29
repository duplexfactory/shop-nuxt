import {defineEventHandler} from "h3";
import {shopSuggestionCollection} from "~/server/firebase/collections";

export default defineEventHandler(async (event) => {
    const {
        username
    } = await readBody<{ username: string }>(event);
    const suggestion = {
        username,
        created: Date.now(),
    };

    const reference = await shopSuggestionCollection().add(suggestion);
    return {
        id: reference.id
    };
});
