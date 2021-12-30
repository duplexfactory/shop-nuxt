import type { IncomingMessage, ServerResponse } from 'http'
import * as url from "url"
import fetch from 'node-fetch'

export default async (req: IncomingMessage, res: ServerResponse) => {

    const params = url.parse(req.url as string, true).query;
    const {id} = params

    let r = await fetch(`https://www.instagram.com/${id}/channel?__a=1`, {
        headers: {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'}
    });
    console.log(r);
    const jsonString = await r.text();
    console.log(jsonString);
    const data = JSON.parse(jsonString);

    const lastActive = new Date(data.graphql.user.edge_owner_to_timeline_media.edges.at(0).node.taken_at_timestamp * 1000);

    const description = data.graphql.user.biography;

    return {
        message: 'Hello World',
        id,
        lastActive: lastActive.getTime(),
        description
    }
}
