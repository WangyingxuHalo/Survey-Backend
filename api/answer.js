const Router = require("koa-router")
const router = new Router();

const { Answer } = require("../models/answer")
const { Question } = require("../models/question")

router.post('/api/answer', async (ctx) => {
    const body = ctx.request.body
    const { questionId, answerList = [], identifier } = body

    answerList.forEach(async (answer) => {
        const { componentId, value } = answer
        const answerToCreate = { fe_id: componentId, value, question_id: questionId, identifier }
        await Answer.create(answerToCreate)
    })
    await Question.increment('answerCount', { where: { id: questionId}})

    ctx.body = {
        errno: 0
    }
})

module.exports = router