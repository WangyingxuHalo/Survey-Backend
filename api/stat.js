const Router = require("koa-router");
const { Question } = require("../models/question");
const { Component } = require("../models/component");
const { Answer } = require("../models/answer");
const { Auth } = require("../middlewares/auth");
const router = new Router({
    prefix: "/api/stat"
});

// get question list for survey-client
router.get('/:questionId', async (ctx) => {

    const questionId = ctx.params.questionId

    const surveyFound = await Question.findOne({
        where: {
            id: questionId
        }
    })

    // Not exist
    if (surveyFound == null) {
        ctx.body = {
            errno: 1,
            msg: "没有该问卷"
        }
        return;
    }

    const { title, desc, isDeleted, isPublished } = surveyFound

    const componentListFound = await Component.findAll({
        where: {
            question_id: questionId
        },
        order: [
            ['order', 'ASC']
        ]
    })
    const componentList = []

    componentListFound.forEach(comp => {
        const { fe_id, type, isHidden, props } = comp
        componentList.push({ fe_id, type, isHidden, props })
    })

    const data = { id: parseInt(questionId) || 1, title, desc, isDeleted, isPublished, componentList }

    ctx.body = {
        errno: 0,
        data
    }
})

// get question list for survey-client
router.get('/tob/:questionId', async (ctx) => {

    const questionId = ctx.params.questionId

    const surveyFound = await Question.findOne({
        where: {
            id: questionId
        }
    })

    // Not exist
    if (surveyFound == null) {
        ctx.body = {
            errno: 1,
            msg: "没有该问卷"
        }
        return;
    }

    const { title, desc, isDeleted, isPublished } = surveyFound

    const answersGroupByUser = await Answer.findAll({
        where: {
            question_id: questionId,
        },
        attributes: ['fe_id', 'value', 'identifier']
    })

    const identifierSet = new Set()
    const map = {}

    /**
     * {
     *  _id: xxx
     *  fe_id1: value1
     *  fe_id2: value2
     *  fe_id3: value3
     * }
     * 
     */

    // check how many users have filled the survey
    answersGroupByUser.forEach(({ fe_id, value, identifier }) => {
        if (!identifierSet.has(identifier)) {
            identifierSet.add(identifier)
            map[identifier] = { _id: identifier }
        }
        // add into map
        map[identifier][fe_id] = value
    })
    const total = identifierSet.size
    const retData = Object.values(map)

    ctx.body = {
        errno: 0,
        data: {
            total,
            list: retData
        }

    }
})

// user see survey results
router.get('/tob/:questionId/:componentId/:selectedComponentType', new Auth().m, async (ctx) => {
    const { questionId, componentId, selectedComponentType } = ctx.params // get :id

    // only calculate the questionRadio and questionCheckbox data
    if (selectedComponentType !== "questionRadio" && selectedComponentType !== "questionCheckbox") {
        ctx.body = {
            errno: 0,
            data: {
                stat: []
            }
        }
        return;
    }

    const allAnswers = await Answer.findAll({
        where: {
            fe_id: componentId,
            question_id: questionId

        },
        attributes: ['value']
    })
    const retDataMap = {}
    const valueSet = new Set()
    const retData = []
    if (selectedComponentType === "questionRadio") {
        // count the number of each value and put in a map
        allAnswers.forEach(({ value }) => {
            if (!valueSet.has(value)) {
                valueSet.add(value)
                retDataMap[value] = 0
            }
            retDataMap[value]++
        })
    } else if (selectedComponentType === "questionCheckbox") {
        allAnswers.forEach(({ value }) => {
            // first split by ','
            const valuesArr = value.split(",").filter(val => val !== "")
            valuesArr.forEach(checkboxValue => {
                if (!valueSet.has(checkboxValue)) {
                    valueSet.add(checkboxValue)
                    retDataMap[checkboxValue] = 0
                }
                retDataMap[checkboxValue]++
            })

        })
    }

    // put it into the format of return data
    Object.keys(retDataMap).forEach(key => {
        retData.push({ name: key, count: retDataMap[key] })
    })

    ctx.body = {
        errno: 0,
        data: {
            stat: retData
        }
    }
})

module.exports = router