function toUnicodeNum(str: string) {
    return str.split("").map(function (value, index, array) {
        return value.charCodeAt(0);
    });
}

function codeBase16(code: number) {
    return "\\u" + code.toString(16).toUpperCase().padStart(4, "0");
}

const uAlps = ["🅐"];
const lAlps = [];
const pairs = lAlps.map(toUnicodeNum);

const latinMap = {
    H: ["ʜ"],
    K: ["ᴋ"],
    D: ["ᴅ"]
}

export function replaceUpperAlphabets(txt: string) {
    if (!uAlps.length) return txt;

    let tmp = txt;

    const uPairs = uAlps.map(toUnicodeNum);
    const A = "A".charCodeAt(0);
    for (let i = 0; i < 26; i++) {
        const reg = new RegExp(`(${uPairs.map(([base, start])=>`${codeBase16(base)}${codeBase16(start+i)}`).join("|")})`, "g");
        tmp = tmp.replace(reg, String.fromCharCode(A + i));
    }

    return tmp;
}

export function replaceLowerAlphabets(txt: string) {
    if (!lAlps.length) return txt;

    let tmp = txt;

    const lPairs = lAlps.map(toUnicodeNum);
    const a = "a".charCodeAt(0);
    for (let i = 0; i < 26; i++) {
        const reg = new RegExp(`(${lPairs.map(([base, start])=>`${codeBase16(base)}${codeBase16(start+i)}`).join("|")})`, "g");
        tmp = tmp.replace(reg, String.fromCharCode(a + i));
    }

    return tmp;
}

export function replaceLatinAlphabets(txt: string) {

    if (!Object.keys(latinMap).length) return txt;

    let tmp = txt;

    for (const char of Object.keys(latinMap)) {
        const codes = latinMap[char].map(toUnicodeNum);
        const reg = new RegExp(
            `(${codes.map(([base, start])=> start ? `${codeBase16(base)}${codeBase16(start)}` : `${codeBase16(base)}`).join("|")})`,
            "g"
        );
        tmp = tmp.replace(reg, char);
    }

    return tmp;
}

export function replaceAlphabets(txt: string) {
    return replaceLowerAlphabets(replaceUpperAlphabets(replaceLatinAlphabets(txt)));
}
