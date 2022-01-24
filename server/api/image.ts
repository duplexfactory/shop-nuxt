import type {IncomingMessage, ServerResponse} from 'http'
import stream from "stream";
import util from "util";
import fetch from "node-fetch";
import {useQuery} from "h3";
import {decryptImageUrl} from "~/utils/imageUrl";

const pipe = util.promisify(stream.pipeline);

export default async (req: IncomingMessage, res: ServerResponse) => {
    const {i} = await useQuery(req) as { i: string }
    const url = decryptImageUrl(i)
    if (!url.startsWith("https://instagram."))
        throw new Error()

    const headers = Object.assign({}, req.headers) as Record<string, string>
    delete headers.host
    const f = await fetch(url, {headers: headers})
    res.writeHead(f.status, f.statusText, f.headers.raw())
    await pipe(f.body, res)
    res.end()
}
