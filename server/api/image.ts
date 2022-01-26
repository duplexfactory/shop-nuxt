import type {IncomingMessage, ServerResponse} from 'http'
import stream from "stream";
import util from "util";
import fetch from "node-fetch";
import {useQuery} from "h3";

const pipe = util.promisify(stream.pipeline);

import cryptoJS from "crypto-js";
import Utf8 from 'crypto-js/enc-utf8.js';
import config from '#config';

export function decryptImageUrl(code: string) {
    const decrpyted = cryptoJS.AES.decrypt(code.replace(/-/g, "/").replace(/\./g, "+"), config.IMAGE_KEY, );
    return decrpyted.toString(Utf8);
}

export default async (req: IncomingMessage, res: ServerResponse) => {
    const {i} = await useQuery(req) as { i: string }

    const url = new URL(decryptImageUrl(i))
    const host = url.hostname
    if (!host.includes("instagram") || !host.includes("cdn"))
        throw new Error()

    const headers = Object.assign({}, req.headers) as Record<string, string>
    delete headers.host
    const f = await fetch(url.toString(), {headers: headers})
    res.writeHead(f.status, f.statusText, f.headers.raw())
    await pipe(f.body, res)
    res.end()
}
