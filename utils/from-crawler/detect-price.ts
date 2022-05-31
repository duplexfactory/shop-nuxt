import {normalizeText} from "~/utils/from-crawler/normalize-text";

type Matcher = { [Symbol.match](string: string): RegExpMatchArray | null; }

function tryMatch(txt: string, matchers: Matcher[]) {
    for (const matcher of matchers) {
        const match = txt.match(matcher);
        if (match?.length) return match[1];
    }
    return undefined;
}

export function detectPrice(caption: string) {
    const cap = normalizeText(caption)
        .toLowerCase()
        .replace(/[\d]+(號|日|折)/g, "")
        .replace("減價", "")
        .replace(/(訂金|滿|🈵|\+|加|消費|減|扣除|扣|留位|原價|價值|得|存款)[^\d\r\n^a-z]?(\$|hkd|hkd\$|hk|港幣|price)[^\d\r\n]?(\d+(?:,\d{3})*(?:\.\d{1,2})?)/g, "")
        .replace(/(\$|(?:^|[^a-z])hkd|(?:^|[^a-z])hkd\$|(?:^|[^a-z])hk|港幣|price)[^\d\r\n]?(\d+(?:,\d{3})*(?:\.\d{1,2})?)[^\d\r\n]*(留位)/g, "")
        // .replace(/(\$|(?:^|[^a-z])hkd|(?:^|[^a-z])hkd\$|(?:^|[^a-z])hk|港幣|price)[^\d\r\n]?(\d+(?:,\d{3})*(?:\.\d{1,2})?)x/g, "");

    const matched = tryMatch(cap, [
        /特價[ ]?(?:\$|[^a-z]?hkd|[^a-z]?hkd\$|[^a-z]?hk|港幣|price)[^\d\r\n]?(\d+(?:,\d{3})*(?:\.\d{1,2})?)/,
        /特價[ ]?(\d+(?:,\d{3})*(?:\.\d{1,2})?)@/,
        /(?:\$|(?:^|[^a-z])hkd|(?:^|[^a-z])hkd\$|(?:^|[^a-z])hk|售價)[^\d\r\n]?(\d+(?:,\d{3})*(?:\.\d{1,2})?)/,
        /(\d+(?:,\d{3})*(?:\.\d{1,2})?)(?:@|[^a-z\d]?hkd)/
    ]);
    return matched ? Number(matched.replace(",", "")) : undefined;
}
