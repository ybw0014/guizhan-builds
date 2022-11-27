/**
 * 对 axios 库进行封装
 * @author ybw0014
 */

const axios = require('axios')

let request = axios.create({
    timeout: 5000,
    headers: {
        Authorization: `Bearer ${process.env.BOT_TOKEN}`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36'
    }
})

module.exports = request
