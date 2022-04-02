import type { IncomingMessage, ServerResponse } from 'http'

export default function (req: IncomingMessage, res: ServerResponse, next) {
    res.setHeader('Cache-Control', 'max-age=28800');
    next();
}