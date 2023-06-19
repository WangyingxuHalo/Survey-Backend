const basicAuth = require("basic-auth")
const jwt = require("jsonwebtoken")
const { security } = require("../config/config")
const { TokenException } = require("../core/http-exception")

class Auth {
    constructor() {

    }

    get m() {
        return async (ctx, next) => {
            const authHeader = ctx.headers.authorization
            if (!authHeader || !authHeader.startsWith("Basic")) {
                throw new Error("header不正确")
            }
            const token = authHeader.split(" ")[1]
            
            try {
                var decode = jwt.verify(token, security.secreteKey)
            } catch (error) {
                // 1: token 已过期
                if (error.name === "TokenExpiredError") {
                    throw new TokenException("token已过期")
                }
                // 2: token 不合法
                throw new TokenException("token不合法")
            }
            // token合法
            ctx.auth = {
                uid: decode.uid
            }

            // 调用下一个中间件
            await next()

        }
    }
}

module.exports = {
    Auth
}