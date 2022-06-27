/**
 * 对 axios 库进行封装
 * @author ybw0014
 */

const axios = require('axios')

let request = axios.create({
    timeout: 5000
})

request.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${process.env.BOT_TOKEN}`
    return config
}, null)

module.exports = request
