/**
 * 有关项目的所有方法
 * @author ybw0014
 */

const fileSystem = require('fs')
const fs = fileSystem.promises
const path = require('path')

module.exports = {
    /**
     * 获取所有项目
     * @returns {Promise} 包含项目列表的Promise
     */
    getProjects() {
        return new Promise((resolve, reject) => {
            fs.readFile(path.resolve(process.cwd(), './static/repos.json'))
                .then((repos) => {
                    const tasks = []
                    const json = JSON.parse(repos)

                    for (const repo in json) {
                        console.log(`> 已加载项目 ${repo}`)

                        let taskInfo = {
                            user: repo.split('/')[0],
                            repo: repo.split('/')[1].split(':')[0],
                            branch: repo.split(':')[1]
                        }

                        taskInfo.directory = taskInfo.user + '/' + taskInfo.repo + '/' + taskInfo.branch

                        if (json[repo].options) {
                            taskInfo.options = json[repo].options
                        }

                        tasks.push(taskInfo)
                    }

                    resolve(tasks)
                }, reject)
        })
    },

    /**
     * 获取最新构建信息
     * @param dir 本地项目目录
     */
    getLatestBuild(dir) {
        return new Promise((resolve, reject) => {
            fs.readFile(path.resolve(__dirname, `../../static/f/${dir}/builds.json`))
                .then((builds) => {
                    let json = JSON.parse(builds)
                    resolve(json[0])
                }).catch((error) => {
                    reject(error)
                })
        })
    }
}
