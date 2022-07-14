/**
 * 有关QQ的所有方法
 * @author ybw0014
 */

const axios = require('axios')

module.exports = {
    deliverBuildStatus
}

function deliverBuildStatus (task) {
    return new Promise((resolve, reject) => {
        let build = {
            user: task.user,
            repo: task.repo,
            branch: task.branch,
            version: task.version,
            success: task.success
        }

        axios({
            url: process.env.WEBHOOK_URL,
            method: 'post',
            headers: { Authorization: process.env.WEBHOOK_AUTHORIZATION },
            data: build
        }).then(resolve, reject)
    })
}
