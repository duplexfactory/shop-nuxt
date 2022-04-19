import type { IncomingMessage, ServerResponse } from 'http'

export default function (req: IncomingMessage, res: ServerResponse, next) {
    if(!res.getHeader('Cache-Control'))
        res.setHeader('Cache-Control', 'max-age=28800');
    next();
}
