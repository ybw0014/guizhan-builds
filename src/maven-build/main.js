/**
 * 主程序
 * @author ybw0014
 */

const projects = require('./projects')
const github = require('./github')

module.exports = {
    /**
     * 开始工作流
     * @returns {Promise} 处理完工作流中所有任务后返回的 Promise
     */
    start() {
        return new Promise((resolve, reject) => {
            console.log('正在加载所有项目')

            projects.getProjects().then((tasks) => {
                global.status.tasks = tasks.slice()

                // 将所有项目任务加入队列
                for (const index in tasks) {
                    this.updateStatus(index, '正在队列中')
                }

                let i = -1

                // 运行任务
                const nextTask = () => {
                    i++
                    if (!global.status.running || i >= tasks.length) {
                        console.log('')
                        console.log('已完成所有任务')
                        resolve()
                    } else {
                        let currentTask = tasks[i]
                        console.log('')
                        console.log(`正在运行 ${currentTask.directory} (${i + 1}/${tasks.length})`)

                        this.check(currentTask)
                            .then(() => this.update(currentTask)
                                .then(() => this.compile(currentTask),
                                    reject),
                            nextTask)
                    }
                }

                nextTask()
            }, reject)
        })
    },

    /**
     * 检查最新commit
     * @param task 需要检查的任务
     * @returns {Promise}
     */
    check(task) {
        task.status = '获取最新commit'

        return new Promise((resolve, reject) => {
            github.getLatestCommit(task).then((commit) => {
                // let latestBuild = projects.getLatestBuild(task.directory)
            }).catch((error) => {
                reject(error)
            })
        })
    },

    /**
     * 更新任务状态
     * @param index 任务索引
     * @param status 状态
     */
    updateStatus(index, status) {
        global.status.tasks[index].status = status
    }
}
