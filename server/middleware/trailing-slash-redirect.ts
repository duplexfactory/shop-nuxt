export default function (req, res, next) {
    // // req is the Node.js http request object
    // console.log(req.url)
    // // res is the Node.js http response object
    // // next is a function to call to invoke the next middleware
    // // Don't forget to call next at the end if your middleware is not an endpoint!
    // next()

    if (req.url != '/' && !req.url.match(/^((?!\?).)*(?<!\/|\.js|\.css|\.txt)(\?.*\=.*)*$/)) {
        if (req.url.match(/\/\?/)) {
            res.writeHead(301, { Location: req.url.replace('/?', '?') });
        } else {
            res.writeHead(301, { Location: req.url.slice(0, -1) });
        }
        res.end();
    }
    else {
        next();
    }

}