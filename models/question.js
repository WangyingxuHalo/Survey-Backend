const { Sequelize, Model, DataTypes } = require("sequelize")
const { sequelize } = require("../core/db")
const { User } = require("./user")

class Question extends Model {}
Question.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: Sequelize.STRING,
    desc: Sequelize.TEXT,
    js: Sequelize.TEXT,
    css: Sequelize.TEXT,
    isPublished: Sequelize.BOOLEAN,
    isStar: Sequelize.BOOLEAN,
    answerCount: Sequelize.INTEGER,
    user_id: {
        type: Sequelize.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    }
}, {
    sequelize,
    tableName: "question"
})

module.exports = {
    Question
}