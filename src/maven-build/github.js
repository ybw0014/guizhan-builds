/**
 * 有关 Github 的所有方法
 * @author ybw0014
 */

const request = require('axios')
request.defaults.baseURL = 'https://api.github.com/'

module.exports = {
    /**
     * 获取任务仓库的最新commit
     * @param task 任务
     * @returns {Promise} 包含
     */
    getLatestCommit(task) {
        return new Promise((resolve, reject) => {
            console.log('> 获取最新commit...')

            request({
                url: `/repos/${task.user}/${task.repo}/commits`,
                params: {
                    per_page: 1,
                    page: 1,
                    sha: `${task.branch}`
                }
            }).then((response) => {
                resolve(response.data[0])
            }).catch((error) => {
                reject(error)
            })
        })
    }
}
