const Sequelize = require("sequelize")
const { dbName, host, port, user, password } = require("../config/config").database

const sequelize = new Sequelize(dbName, user, password, {
    dialect: "mysql",
    host,
    port,
    logging: true,
    timezone: "+08:00", // 北京时间
    define: {
        timestamps: true, // createdAt | updatedAt
        paranoid: true // deletedAt
    }
})

sequelize.sync()

module.exports = {
    sequelize
}