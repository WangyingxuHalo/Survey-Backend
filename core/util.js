const jwt = require("jsonwebtoken")
const { security } = require("../config/config")

const generateToken = function (uid) {
    const { secreteKey, expiresIn } = security
    const token = jwt.sign({
        uid,
    }, secreteKey, {
        expiresIn
    })
    return token
}

module.exports = { generateToken }