/**
 * 主程序
 * @author ybw0014
 */

const datetime = require('./datetime')
const github = require('./github')
const maven = require('./maven')
const projects = require('./projects')

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
                                .then(() => this.build(currentTask)
                                    .then(() => this.upload(currentTask)
                                        .then(() => this.finish(currentTask)
                                            .then(() => this.updateStatus(i, '已完成'))
                                            .then(nextTask, reject),
                                        reject),
                                    reject),
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
     * @returns {Promise} 如需新构建则resolve
     */
    check(task) {
        task.status = '获取最新commit'

        return new Promise((resolve, reject) => {
            github.getLatestCommit(task).then((commit) => {
                if (commit.commit.message.toLowerCase().startsWith('[ci skip]')) {
                    reject(new Error('跳过构建'))
                    return
                }

                let timestamp = datetime.isoToTimestamp(commit.commit.author.date)

                task.commit = {
                    hash: commit.sha,
                    timestamp,
                    message: commit.commit.message,
                    author: commit.author.login
                }

                projects.hasUpdate(task, timestamp).then((version) => {
                    task.version = version
                    task.status = '清理工作区'
                    projects.clearWorkspace(task).then(resolve, reject)
                }, reject)
            }).catch(reject)
        })
    },
    /**
     * 获取并更新仓库内容
     * @param task 任务
     * @returns {Promise} 更新信息成功则resolve
     */
    update(task) {
        task.status = '更新仓库中'
        return new Promise((resolve, reject) => {
            github.clone(task).then(() => {
                maven.setVersion(task).then(resolve, reject)
            })
        })
    },
    /**
     * 构建项目
     * @param task 项目
     * @returns {Promise} 构建成功则resolve
     */
    build(task) {
        task.status = '编译项目中'
        return new Promise((resolve, reject) => {
            maven.build(task).then(() => {
                console.log('> 编译成功')
                task.success = true
                resolve()
            }).catch((error) => {
                console.log('> 编译失败')
                console.error(error)
                task.success = false
                resolve()
            })
        })
    },
    /**
     * 将构建完成的文件上传并更新构建信息
     * @param task 任务
     * @returns {Promise} 上传成功则resolve
     */
    upload(task) {
        task.status = '上传构建结果'
        return new Promise((resolve, reject) => {
            console.log('> 上传构建文件')

            Promise.all([
                projects.addBuild(task),
                projects.addBadge(task),
                maven.relocateTarget(task)
            ]).then(() => {
                resolve()
            }, reject)
        })
    },
    /**
     * 完成任务的清理工作
     * @param task 任务
     * @returns {Promise} 总是resolve
     */
    finish (task) {
        return new Promise((resolve, reject) => {
            console.log('> 提交改动')
            projects.clearWorkspace(task)
            resolve()
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
