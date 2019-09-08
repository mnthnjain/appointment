const db = {
    IP: "127.0.0.1",
    port: 27017,
    userName: 'admin',
    password: 'admin123'
}

const envSetup = {
    dev: {
        port: 3000,
    },
    prod: {
        port:8000
    }
}
const env = "prod";

module.exports = {
    db, env, envSetup
}