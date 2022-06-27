/**
 * 有关 Github 的所有方法
 * @author ybw0014
 */

const path = require('path')
const childProcess = require('child_process')

const logger = require('./logger')
const projects = require('./projects')
const request = require('./request')
request.defaults.baseURL = 'https://api.github.com/'

module.exports = {
    getLatestCommit,
    clone,
    pushChanges
}

/**
 * 获取任务仓库的最新commit
 * @param task 任务
 * @returns {Promise} 包含最新commit
 */
function getLatestCommit (task) {
    return new Promise((resolve, reject) => {
        logger.log('> 获取最新commit...')

        request({
            url: `/repos/${task.user}/${task.repo}/commits`,
            params: {
                per_page: 1,
                page: 1,
                sha: `${task.branch}`
            }
        }).then((response) => {
            logger.log('> 已获取最新commit')
            resolve(response.data[0])
        }).catch((error) => {
            logger.log('> 获取最新commit失败,跳过构建')
            logger.axiosError(error)
            reject(error)
        })
    })
}

/**
 * 克隆仓库并重制到任务commit
 * @param task 任务
 * @returns {Promise} 如果任务均执行成功则resolve
 */
function clone (task) {
    return new Promise((resolve, reject) => {
        let dir = projects.getWorkingDirectory(task)

        logger.log('> 正在克隆仓库')

        const gitClone = childProcess.spawn('git', [
            'clone',
            'https://github.com/' + task.user + '/' + task.repo + '.git',
            dir,
            '-b', task.branch,
            '--single-branch'
        ])

        gitClone.stdout.on('data', (data) => {
            logger.log('git> ' + data)
        })
        gitClone.stderr.on('data', (data) => {
            logger.log('git> ' + data)
        })

        gitClone.on('close', () => {
            logger.log('> 已克隆仓库,正在将分支重置到commit:', task.commit.hash)

            const gitReset = childProcess.spawn('git', [
                'reset',
                '--hard',
                task.commit.hash
            ], {
                cwd: dir
            })

            gitReset.stdout.on('data', (data) => {
                logger.log('git> ' + data)
            })
            gitReset.stderr.on('data', (data) => {
                logger.log('git> ' + data)
            })

            gitReset.on('close', () => {
                logger.log('> 已重置该分支')
                resolve()
            })
        })
    })
}

/**
 * 推送任务更改
 * @param task 任务
 * @returns {Promise<unknown>}
 */
function pushChanges (task) {
    return new Promise((resolve, reject) => {
        logger.log('> 推送更改')

        let addFiles = path.resolve(projects.getWorkingDirectory(task), '../') + '/*'
        let commitMsg = (task.success ? '构建成功: ' : '构建失败: ') + task.repoStr + ' (' + task.version + ')'

        logger.log(`>> git add ${addFiles}`)
        let gitAdd = childProcess.spawnSync('git', [
            'add',
            addFiles
        ])
        logger.log('git > ', gitAdd.stdout.toString())
        logger.log('git > ', gitAdd.stderr.toString())

        logger.log(`>> git commit -m "${commitMsg}"`)
        let gitCommit = childProcess.spawnSync('git', [
            'commit',
            '-m',
            commitMsg
        ])
        logger.log('git > ', gitCommit.stdout.toString())
        logger.log('git > ', gitCommit.stderr.toString())

        logger.log('>> git push origin --force')
        let gitPush = childProcess.spawnSync('git', ['push', 'origin', '--force'])
        logger.log('git > ', gitPush.stdout.toString())
        logger.log('git > ', gitPush.stderr.toString())

        logger.log('> 已推送至远程仓库')
        resolve()
    })
}
