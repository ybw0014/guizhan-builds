/**
 * 主程序
 * @author ybw0014
 */

const path = require('path')
const childProcess = require('child_process')
const core = require('@actions/core')

const datetime = require('./datetime')
const github = require('./github')
const gradle = require('./gradle')
const logger = require('./logger')
const maven = require('./maven')
const projects = require('./projects')
const qq = require('./qq')

module.exports = {
    start
}

/**
 * 开始工作流
 * @returns {Promise} 处理完工作流中所有任务后返回的 Promise
 */
function start () {
    // Setup
    let gitOptions = {
        cwd: path.resolve(__dirname, '../../'),
        env: process.env,
        stdio: [process.stdin, process.stdout, process.stderr],
        encoding: 'utf-8'
    }
    childProcess.spawnSync('git', [
        'config',
        'user.name',
        process.env.BOT_USERNAME
    ], gitOptions)
    childProcess.spawnSync('git', [
        'config',
        'user.name',
        process.env.BOT_EMAIL
    ], gitOptions)
    childProcess.spawnSync('git', [
        'remote',
        'set-url',
        'origin',
        `https://${process.env.BOT_TOKEN}@github.com/ybw0014/guizhan-builds.git`
    ], gitOptions)

    logger.log('> 正在克隆仓库')

    return new Promise((resolve, reject) => {
        logger.log('正在加载所有项目')

        projects.getProjects().then((tasks) => {
            global.status.tasks = tasks.slice()

            // 将所有项目任务加入队列
            for (const index in tasks) {
                updateStatus(index, '正在队列中')
            }

            let i = -1

            // 运行任务
            const nextTask = () => {
                i++
                if (!global.status.running || i >= tasks.length) {
                    logger.log('')
                    logger.log('已完成所有任务')
                    resolve()
                } else {
                    let currentTask = tasks[i]
                    logger.log('')
                    logger.log(`正在运行 ${currentTask.directory} (${i + 1}/${tasks.length})`)

                    check(currentTask)
                        .then(() => update(currentTask)
                            .then(() => build(currentTask)
                                .then(() => upload(currentTask)
                                    .then(() => finish(currentTask)
                                        .then(() => updateStatus(i, '已完成'))
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
}

/**
 * 检查最新commit
 * @param task 需要检查的任务
 * @returns {Promise} 如需新构建则resolve
 */
function check (task) {
    task.status = '获取最新commit'

    return new Promise((resolve, reject) => {
        github.getLatestCommit(task).then((commit) => {
            if (commit.commit.message.toLowerCase().startsWith('[ci skip]')) {
                logger.log('> 跳过构建')
                reject(new Error('跳过构建'))
                return
            }

            let timestamp = datetime.isoToTimestamp(commit.commit.author.date)

            task.commit = {
                hash: commit.sha,
                timestamp,
                message: commit.commit.message,
                author: commit.commit.author.name
            }

            projects.hasUpdate(task, timestamp).then((version) => {
                task.version = version
                task.status = '构建前准备中'
                projects.prepareBuild(task).then(resolve, reject)
            }, reject)
        }).catch(reject)
    })
}

/**
 * 获取并更新仓库内容
 * @param task 任务
 * @returns {Promise} 更新信息成功则resolve
 */
function update (task) {
    task.status = '更新仓库中'
    return new Promise((resolve, reject) => {
        github.clone(task).then(() => {
            if (task.buildTool === 'gradle') {
                gradle.setVersion(task).then(resolve, reject)
            } else {
                maven.setVersion(task).then(resolve, reject)
            }
        })
    })
}

/**
 * 构建项目
 * @param task 项目
 * @returns {Promise} 构建成功则resolve
 */
function build (task) {
    task.status = '构建项目中'
    return new Promise((resolve, reject) => {
        let buildTask
        if (task.buildTool === 'gradle') {
            buildTask = gradle.build(task)
        } else {
            buildTask = maven.build(task)
        }

        buildTask.then(() => {
            logger.log('> 编译成功')
            task.success = true
            resolve()
        }).catch((error) => {
            logger.log('> 编译失败')
            logger.error(error)
            task.success = false
            resolve()
        })
    })
}

/**
 * 将构建完成的文件上传并更新构建信息
 * @param task 任务
 * @returns {Promise} 上传成功则resolve
 */
function upload (task) {
    task.status = '上传构建结果'
    return new Promise((resolve, reject) => {
        logger.log('> 上传构建文件')

        let workflows = [
            projects.addBuild(task),
            projects.addBadge(task),
            qq.deliverBuildStatus(task)
        ]
        if (task.buildTool === 'gradle') {
            workflows.push(gradle.relocateTarget(task))
        } else {
            workflows.push(maven.relocateTarget(task))
        }

        Promise.all(workflows).then(() => {
            core.setOutput('HAS_UPDATE', 'true')
            resolve()
        }, reject)
    })
}

/**
 * 完成任务的清理工作
 * @param task 任务
 * @returns {Promise} 总是resolve
 */
function finish (task) {
    return new Promise((resolve, reject) => {
        logger.log('> 提交改动')
        github.pushChanges(task).then(() =>
            projects.clearWorkspace(task).then(resolve, reject)
        )
    })
}

/**
 * 更新任务状态
 * @param index 任务索引
 * @param status 状态
 */
function updateStatus (index, status) {
    global.status.tasks[index].status = status
}
