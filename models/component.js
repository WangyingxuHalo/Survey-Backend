const { Sequelize, Model, DataTypes } = require("sequelize")
const { sequelize } = require("../core/db")
const { Question } = require("./question")

class Component extends Model {}
Component.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fe_id: Sequelize.STRING,
    type: Sequelize.STRING,
    title: Sequelize.STRING,
    isHidden: Sequelize.BOOLEAN,
    isLocked: Sequelize.BOOLEAN,
    order: Sequelize.INTEGER,
    props: Sequelize.JSON,
    question_id: {
        type: Sequelize.INTEGER,
        references: {
            model: Question,
            key: 'id'
        }
    }
}, {
    sequelize,
    tableName: "component"
})

module.exports = {
    Component
}