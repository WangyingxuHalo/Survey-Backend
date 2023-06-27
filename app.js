const Koa = require("koa")
const cors = require("@koa/cors")
const InitManager = require("./core/init")
const parser = require("koa-bodyparser")
const catchError = require("./middlewares/exception")

require("./models/user")
require("./models/question")
require("./models/component")
require("./models/answer")

const app = new Koa()
app.use(catchError)
app.use(parser())
app.use(cors({
    origin: (ctx) => {
        const allowedOrigins = ['http://mysurvey.wwwyxxx.uk', 'https://mysurvey.wwwyxxx.uk'];
        const requestOrigin = ctx.accept.headers.origin;
        if (allowedOrigins.includes(requestOrigin)) {
            return requestOrigin; // Return the same origin, allowing it.
        }
        return false; // Disallow any other origin.
    },
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // specify which HTTP methods are allowed
    credentials: true // allow cookies to be included in the requests
}))
InitManager.initCore(app)

app.listen(3001, "0.0.0.0")

