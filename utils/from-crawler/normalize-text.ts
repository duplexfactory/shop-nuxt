import {replaceAlphabets} from "./alphabets";
import {replaceDigits} from "./digits";

export function normalizeText(txt: string) {
    const tmp = replaceAlphabets(replaceDigits(txt.replace(/💰|💲/, "$"))).normalize("NFKD");

    return tmp.split("\n").filter(l => !!l).map(l => {
        const sp = l.match(/ /g)?.length || 0;
        return sp / l.length >= 0.4 ? l.replace(/ /g, "") : l;
    }).join("\n");
}
