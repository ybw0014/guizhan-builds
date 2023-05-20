/**
 * 主程序
 */

import config from './config'
import logger from './logger'

import git from './git'

async function start(): Promise<void> {
    // git 初始化
    logger.log('# 正在初始化')
    git.init()

    logger.log('# 正在加载所有项目')

    const tasks = await projects.getProjects()
    global.tasks = tasks.slice()
    for (const index in tasks) {
        updateStatus(index, '正在队列中')
    }

    let i = -1

    // 运行任务
    const nextTask = () => {
        i++
        if (!global.running || i >= tasks.length) {
            logger.log('')
            logger.log('已完成所有任务')
        } else {
            let currentTask = tasks[i]
            logger.log('')
            logger.log(`正在执行任务 ${currentTask.repoStr} (${i + 1}/${tasks.length})`)

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
}

export default {
    start
}
