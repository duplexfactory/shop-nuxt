import stream from "stream";
import util from "util";
import fetch from "node-fetch";
import {defineEventHandler, getQuery} from "h3";

const pipe = util.promisify(stream.pipeline);

import cryptoJS from "crypto-js";
import Utf8 from 'crypto-js/enc-utf8.js';
import {IncomingMessage, ServerResponse} from "http";

export function decryptImageUrl(code: string) {
    const decrpyted = cryptoJS.AES.decrypt(code.replace(/-/g, "/").replace(/\./g, "+"), useRuntimeConfig().IMAGE_KEY, );
    return decrpyted.toString(Utf8);
}

export default defineEventHandler(async (event) => {
    const {i} = getQuery(event) as { i: string }

    // const url = new URL(decryptImageUrl(i))
    const url = new URL('https://www.instagram.com/p/' + i + '/media/?size=m')
    const host = url.hostname
    // if (!host.includes("instagram") || !host.includes("cdn"))
    // if (!host.includes("instagram"))
    //     throw new Error()

    const headers = Object.assign({}, (event.req as IncomingMessage).headers) as Record<string, string>;
    delete headers.host;
    const f = await fetch(url.toString(), {headers: headers});
    event.res.writeHead(f.status, f.statusText, f.headers.raw())
    await pipe(f.body, (event.res as any as ServerResponse))
    // res.end()
})
