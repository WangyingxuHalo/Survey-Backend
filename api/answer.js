const Router = require("koa-router")
const router = new Router();

router.get('/api/answer', (ctx, next) => {
    // ctx.body = { key: "hi" }
    console.log("hii")
})

module.exports = router