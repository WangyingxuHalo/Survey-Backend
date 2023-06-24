const { Sequelize, Model} = require("sequelize")
const { sequelize } = require("../core/db")
const { Question } = require("./question")
const { Component } = require("./component")

class Answer extends Model {}
Answer.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fe_id: Sequelize.STRING,
    value: Sequelize.STRING,
    identifier: Sequelize.STRING, // To distinguish which anonymous person fill this answer
    question_id: {
        type: Sequelize.INTEGER,
        references: {
            model: Question,
            key: 'id'
        }
    }
}, {
    sequelize,
    tableName: "answer"
})

module.exports = {
    Answer
}