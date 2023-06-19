const Router = require("koa-router")
const router = new Router({
    prefix: "/api/question"
});
const { HttpException, ParameterException } = require("../core/http-exception")

const { Auth } = require("../middlewares/auth");
const { Question } = require("../models/question");

// router.post('/:id', new Auth().m, (ctx, next) => {
//     const path = ctx.params // get :id
//     const query = ctx.request.query // get ?xxx
//     const headers = ctx.request.header // get headers
//     const body = ctx.request.body // get body content
//     if (true) {
//         const error = new ParameterException()
//         throw error
//     }
//     ctx.body = {
//         errno: 0
//     }
// })

// retrieve all the surveys of current user
router.get('/', new Auth().m, async (ctx) => {
    const { uid } = ctx.auth
    console.log("uid: ", uid)
    const { keyword, page, pageSize } = ctx.query
    ctx.body = {
        errno: 0,
        data: {
            list: [],
            total: 0
        }
    }
})

// create new survey
router.post('/', new Auth().m, async (ctx) => {
    const { uid } = ctx.auth
    const title = "标题", desc = "描述", js = "", css = "", isPublished = false, isStar = false, user_id = uid, answerCount = 0
    const question = {title, desc, js, css, isPublished, isStar, user_id, answerCount}

    const survey = await Question.create(question)
    const survey_id = survey.id
    ctx.body = {
        errno: 0,
        data: {
            id: survey_id
        }
    }
})

//update survey information
// create new survey
router.patch('/:id', new Auth().m, async (ctx) => {
    const { uid } = ctx.auth
    
    ctx.status = 406
    ctx.body = {
        errno: 0,
        data: {
            id: survey_id
        }
    }
})

module.exports = router