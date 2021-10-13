/**
 * 有关项目本地文件的所有方法
 * @author ybw0014
 */

const fileSystem = require('fs')
const fs = fileSystem.promises
const path = require('path')

const config = require('./config')

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
     * 与本地存储对比，查询是否有更新内容
     *
     * @param task 任务
     * @param timestamp 最新时间戳
     * @returns {Promise} 如果有更新内容则resolve, 包含新版本号
     */
    hasUpdate(task, timestamp) {
        return new Promise((resolve, reject) => {
            const dir = path.resolve(__dirname, '../../', config.projects_dir, task.directory, './builds.json')
            // 检查文件是否存在
            if (!fileSystem.existsSync(dir)) {
                resolve(1)
                return
            }
            fs.readFile(dir).then((builds) => {
                let json = JSON.parse(builds)
                if (json.latest < timestamp) {
                    resolve(json.builds[0].id)
                }
            }).catch(reject)
        })
    },
    /**
     * 获取任务工作目录
     * @param task 任务
     * @returns {string} 工作目录
     */
    getWorkingDirectory(task) {
        return path.resolve(__dirname, '../../', config.projects_dir, task.directory, config.project_workspace_dir)
    },
    /**
     * 清理任务工作区
     * @param task
     */
    clearWorkspace(task) {
        fileSystem.rmdirSync(this.getWorkingDirectory(task), { recursive: true })
        return Promise.resolve()
    }
}
