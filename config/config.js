module.exports = {
    environment: "dev",
    database: {
        dbName: "survey",
        host: "127.0.0.1",
        port: 3306,
        user: "root",
        password: "123456",
    },
    security: {
        secreteKey: "lkasjdoiwal",
        expiresIn: 60*60*24*30, // a month
    }
}