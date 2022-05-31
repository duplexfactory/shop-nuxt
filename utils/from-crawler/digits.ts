// https://blog.alyssachan.space/wp-content/cache/all/symbol/index.html
const spDigits = [
    "0\t⓵\t⓶\t⓷\t⓸\t⓹\t⓺\t⓻\t⓼\t⓽", // no zero
    "⓿\t❶\t❷\t❸\t❹\t❺\t❻\t❼\t❽\t❾",
    "🄁\t🄂\t🄃\t🄄\t🄅\t🄆\t🄇\t🄈\t🄉\t🄊",
    "0️⃣\t1️⃣\t2️⃣\t3️⃣\t4️⃣\t5️⃣\t6️⃣\t7️⃣\t8️⃣\t9️⃣",
].map(sq => sq.split("\t"));

const digits = "0\t1\t2\t3\t4\t5\t6\t7\t8\t9".split("\t");
export default spDigits;

// https://gist.github.com/littlee/f726f61b1e0abd319da4
function toUnicode(str: string) {
    return str.split("").map(function (value, index, array) {
        const temp = value.charCodeAt(0).toString(16).toUpperCase();
        if (temp.length > 2) {
            return "\\u" + temp;
        }
        return value;
    }).join("");
}

export function replaceDigits(txt: string) {
    let tmp = txt;

    for (const [i, digit] of digits.entries()) {
        const reg = new RegExp(`(${spDigits.map(list=>toUnicode(list[i])).join("|")})`, "g");
        tmp = tmp.replace(reg, digit);
    }

    return tmp;
}
