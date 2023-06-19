const Router = require("koa-router")
const router = new Router();

router.get('/api/stat', (ctx, next) => {
    // ctx.body = { key: "hi" }
    console.log("hii")
})

module.exports = router