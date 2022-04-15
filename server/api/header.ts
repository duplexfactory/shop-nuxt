import type { IncomingMessage, ServerResponse } from 'http'

export default (req: IncomingMessage, res: ServerResponse) => {
    return {
        headers: req.headers,
        rawHeaders: req.rawHeaders
    }
}
