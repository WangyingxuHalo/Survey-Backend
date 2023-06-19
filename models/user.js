const { Sequelize, Model } = require("sequelize")
const bcrypt = require("bcryptjs")
const { sequelize } = require("../core/db")

class User extends Model {
    static async verifyUsernamePassword(username, plainPassword) {
        // 查询用户名是否存在
        const userInDatabase = await User.findOne({
            where: {
                username: username
            }
        })
        if (!userInDatabase) {
            throw new Error("用户不存在")
        }
        // 查询用户名密码是否对的上
        const correct = bcrypt.compareSync(plainPassword, userInDatabase.password)
        if (!correct) {
            throw new Error("密码不正确")
        }
        return userInDatabase

    }
}

User.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: Sequelize.STRING,
        unique: true
    },
    nickname: Sequelize.STRING,
    password: {
        type: Sequelize.STRING,
        set(val) {
            // 对密码进行加密
            // 10 => 成本,安全性
            const salt = bcrypt.genSaltSync(10)
            const passwordEncrypted = bcrypt.hashSync(val, salt)
            this.setDataValue("password", passwordEncrypted)
        }
    }
}, {
    sequelize,
    tableName: 'user' // 数据表的名字
})

module.exports = {
    User
}