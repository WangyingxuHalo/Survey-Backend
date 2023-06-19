const Koa = require("koa")
const cors = require("@koa/cors")
const InitManager = require("./core/init")
const parser = require("koa-bodyparser")
const catchError = require("./middlewares/exception")

require("./models/user")
require("./models/question")
require("./models/component")

const app = new Koa()
app.use(catchError)
app.use(parser())
app.use(cors())
InitManager.initCore(app)

app.listen(3001)

