const { HttpException, ParameterException } = require("../core/http-exception")

const catchError = async (ctx, next) => {
    try {
        await next()
    } catch (error) {
        // 开发环境 ｜ 生产环境
        // if (global.config.environment === "dev") {
        //     throw error
        // }

        if (error instanceof HttpException) {
            ctx.status = error.status
            ctx.body = {
                msg: error.msg,
                errno: error.errno,
                request: `${ctx.method} ${ctx.path}`
            }
            ctx.status = error.status
        } else {
            ctx.body = {
                errno: 1,
                msg: error.message,
                request: `${ctx.method} ${ctx.path}`
            }
        }
    }
}

module.exports = catchError