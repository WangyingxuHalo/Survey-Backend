const Router = require("koa-router")
const router = new Router({
    prefix: "/api"
});
const { User } = require("../models/user");
const { generateToken } = require("../core/util");
const { Auth } = require("../middlewares/auth")

// 注册
router.post('/user/register', async (ctx) => {
    const path = ctx.params // get :id
    const query = ctx.request.query // get ?xxx
    const headers = ctx.request.header // get headers
    const body = ctx.request.body // get body content

    // get body content
    const user = {
        username: body.username,
        password: body.password,
        nickname: body.nickname
    }

    // check if username exists in database
    const userInDatabase = await User.findOne({
        where: {
            username: user.username
        }
    })
    if (userInDatabase) {
        throw new Error("用户名已被注册")
    }

    // add to database
    await User.create(user)

    ctx.body = {
        errno: 0
    }
})

// new Auth().m

// 登录
router.post('/user/login', async (ctx) => {
    const path = ctx.params // get :id
    const query = ctx.request.query // get ?xxx
    const headers = ctx.request.header // get headers
    const body = ctx.request.body // get body content

    // get body content
    const user = {
        username: body.username,
        password: body.password,
    }

    // verify user name and password
    const userInDatabase = await User.verifyUsernamePassword(user.username, user.password)
    const tokenGenerated = generateToken(userInDatabase.id)

    ctx.body = {
        errno: 0,
        data: {
            token: tokenGenerated
        }
    }
})

router.get('/user/info', new Auth().m, async (ctx) => {
    const uid = ctx.auth.uid

    const userInDatabase = await User.findOne({
        where: {
            id: uid
        }
    })

    const username = userInDatabase.username;
    const nickname = userInDatabase.nickname;

    ctx.body = {
        errno: 0,
        data: {
            username,
            nickname
        }
    }
})

module.exports = router