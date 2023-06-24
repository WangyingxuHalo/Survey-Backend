const Router = require("koa-router")
const { Op } = require("sequelize")
const router = new Router({
    prefix: "/api/question"
});
const { HttpException, ParameterException } = require("../core/http-exception")

const { Auth } = require("../middlewares/auth");
const { Question } = require("../models/question");
const { Component } = require("../models/component");

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

    // user id
    const { uid } = ctx.auth
    const { keyword, page, pageSize, isStar, isDeleted } = ctx.query

    const pageNumber = parseInt(page) || 1
    const pageSizeNumber = parseInt(pageSize) || 10

    // database search condition
    const whereCondition = {
        title: {
            [Op.like]: `%${keyword}%`
        },
        user_id: uid
    }

    // isStar & isDeleted condition
    if (isStar === "true") {
        whereCondition.isStar = true
    }

    if (isDeleted === "true") {
        whereCondition.isDeleted = true
    } else {
        whereCondition.isDeleted = false
    }

    // Search all the results related to this user
    const { rows, count } = await Question.findAndCountAll({
        where: whereCondition,
        order: [
            ['createdAt', 'DESC']
        ],
        offset: (pageNumber - 1) * pageSizeNumber,
        limit: pageSizeNumber
    })

    // put all the surveys related to this user in the return list
    const retData = []
    rows.forEach(survey => {
        const { id, title, isPublished, isStar, answerCount, createdAt } = survey
        const formattedCreatedAt = createdAt.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
        })
        retData.push({ _id: id, title, isPublished, isStar, answerCount, createdAt: formattedCreatedAt })
    })

    ctx.body = {
        errno: 0,
        data: {
            list: retData,
            total: count
        }
    }
})

// create new survey
router.post('/', new Auth().m, async (ctx) => {
    console.log("trigger create new")
    const { uid } = ctx.auth
    const title = "标题", desc = "描述", js = "", css = "", isPublished = false, isStar = false, user_id = uid, answerCount = 0, isDeleted = false
    const question = { title, desc, js, css, isPublished, isStar, user_id, answerCount, isDeleted }

    const survey = await Question.create(question)
    const survey_id = survey.id
    console.log("new survey id: ", survey_id)
    ctx.body = {
        errno: 0,
        data: {
            id: survey_id
        }
    }
})

// retrieve all the components of a single survey sorted by order
router.get('/:id', new Auth().m, async (ctx) => {
    console.log("trigger this !")
    const { uid } = ctx.auth
    const surveyId = ctx.params.id

    const surveyInfoFound = await Question.findOne({
        where: {
            id: surveyId
        }
    })

    // If cannot find survey
    if (!surveyInfoFound) {
        throw new Error("对应问卷资源未找到")
    }

    const { title, desc, js, css, isPublished, isDeleted } = surveyInfoFound

    // return data
    const retData = {
        id: surveyId,
        title,
        desc,
        js,
        css,
        isPublished,
        isDeleted,
        componentList: []
    }

    const surveyComponents = await Component.findAll({
        where: {
            question_id: surveyId
        },
        order: [
            ['order', 'ASC']
        ]
    })

    surveyComponents.forEach(eachComponent => {
        const { fe_id, type, title, isHidden, isLocked, props } = eachComponent
        const currCompToAdd = {
            fe_id, type, title, isHidden, isLocked, props
        }
        retData.componentList.push(currCompToAdd)
    })

    ctx.body = {
        errno: 0,
        data: retData
    }
})

//update survey information
router.patch('/:id', new Auth().m, async (ctx) => {
    const { uid } = ctx.auth

    const surveyId = ctx.params.id
    const { isStar, isPublished, isDeleted } = ctx.request.body

    const setCondition = {}
    if (isStar === true) {
        setCondition.isStar = true
    }

    if (isPublished === true) {
        setCondition.isPublished = true
    }

    if (isDeleted === true) {
        setCondition.isDeleted = true
    } else if (isDeleted === false) {
        setCondition.isDeleted = false
    }

    // TODO: here
    await Question.update(setCondition, {
        where: {
            id: surveyId
        }
    })

    ctx.body = {
        errno: 0
    }
})

//save survey information
router.patch('/save/:id', new Auth().m, async (ctx) => {
    const { uid } = ctx.auth
    const surveyId = ctx.params.id
    const { title, desc, js, css, isPublished, createIds, componentList, deleteIds } = ctx.request.body
    // update survey info
    Question.update({
        title,
        desc,
        js,
        css,
        isPublished
    }, {
        where: {
            id: surveyId
        }
    })

    // add or update components info
    for (component of componentList) {
        const { fe_id, title, type, props, order, isHidden = false, isLocked = false } = component

        if (createIds.includes(fe_id)) {
            const componentToCreate = { fe_id, title, type, props, order, isHidden, isLocked, question_id: surveyId }
            await Component.create(componentToCreate)
        } else {
            // If it is older one, update information to database
            await Component.update({
                title,
                isHidden,
                isLocked,
                order,
                props,
            }, {
                where: {
                    fe_id: fe_id
                }
            })
        }
    }
    // delete record if it is deleted
    for (deleteId of deleteIds) {
        await Component.destroy({
            where: {
                fe_id: deleteId,
                question_id: surveyId
            }
        })
    }

    // ctx.status = 406
    ctx.body = {
        errno: 0
    }
})

// duplicate survey
router.post('/duplicate/:id', new Auth().m, async (ctx) => {
    const { uid } = ctx.auth
    const surveyIdToDuplicate = ctx.params.id

    // find that survey first in the database
    const surveyFound = await Question.findOne({
        where: {
            id: surveyIdToDuplicate
        }
    })

    if (!surveyFound) {
        throw new Error("找不到当前问卷")
    }


    // duplicate survey info
    const { title, desc, js, css } = surveyFound
    const surveyCopied = { title, desc, js, css, isPublished: false, isStar: false, user_id: uid, answerCount: 0, isDeleted: false }

    const surveyDuplicated = await Question.create(surveyCopied)
    const newSurveyId = surveyDuplicated.id

    // duplicate component info
    const componentsFound = await Component.findAll({
        where: {
            question_id: surveyIdToDuplicate
        }
    })

    // create all copied components
    componentsFound.forEach(async (eachComp) => {
        const { fe_id, type, title, isHidden, isLocked, order, props } = eachComp
        const copiedComponent = { fe_id, type, title, isHidden, isLocked, order, props, question_id: newSurveyId }
        await Component.create(copiedComponent)
    })

    ctx.body = {
        errno: 0,
        data: {
            id: newSurveyId
        }
    }
})

// delete survey from Trash
router.delete('/', new Auth().m, async (ctx, next) => {
    const IdsToDelete = ctx.request.body

    IdsToDelete.forEach(async(id) => {
        await Question.destroy({
            where: {
                id: id
            }
        })
    })
    
    ctx.body = {
        errno: 0
    }
})



module.exports = router