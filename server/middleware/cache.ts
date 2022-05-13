import type { IncomingMessage, ServerResponse } from 'http'

export default defineEventHandler((event) => {
    // if(!event.res.getHeader('Cache-Control'))
    //     event.res.setHeader('Cache-Control', 'max-age=28800');
})
