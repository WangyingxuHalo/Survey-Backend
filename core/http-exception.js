class HttpException extends Error {
    constructor(msg = "服务器异常", status = 400) {
        super()
        this.errno = 1
        this.status = status
        this.msg = msg
    }
}

class ParameterException extends HttpException {
    constructor(msg) {
        super()
        this.errno = 1
        this.msg = msg || "参数错误"
        this.status = 400;
    }
}

class TokenException extends HttpException {
    constructor(msg) {
        super()
        this.errno = 1
        this.msg = msg || "token错误"
        this.status = 401;
    }
}

module.exports = { HttpException, ParameterException, TokenException }