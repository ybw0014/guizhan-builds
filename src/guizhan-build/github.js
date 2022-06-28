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
            logger.log('> 获取最新commit失败, 跳过构建')
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
    return new Promise((resolve, _reject) => {
        let dir = projects.getWorkingDirectory(task)
        let gitOptions = {
            cwd: process.cwd(),
            env: process.env,
            stdio: [process.stdin, process.stdout, process.stderr],
            encoding: 'utf-8'
        }

        logger.log('> 正在克隆仓库')

        childProcess.spawnSync('git', [
            'clone',
            'https://github.com/' + task.user + '/' + task.repo + '.git',
            dir,
            '-b', task.branch,
            '--single-branch'
        ], gitOptions)

        gitOptions.cwd = dir
        logger.log('> 已克隆仓库,正在将分支重置到:', task.commit.hash)
        childProcess.spawnSync('git', [
            'reset',
            '--hard',
            task.commit.hash
        ], gitOptions)

        logger.log('> 已重置该分支')
        resolve()
    })
}

/**
 * 推送任务更改
 * @param task 任务
 * @returns {Promise<unknown>}
 */
function pushChanges (task) {
    return new Promise((resolve, _reject) => {
        logger.log('> 推送更改')

        let dir = projects.getWorkingDirectory(task)
        let addFiles = path.resolve(dir, '../') + '/*'
        let commitMsg = (task.success ? '构建成功: ' : '构建失败: ') + task.repoStr + ' (' + task.version + ')'
        let gitOptions = {
            cwd: dir,
            env: process.env,
            stdio: [process.stdin, process.stdout, process.stderr],
            encoding: 'utf-8'
        }

        childProcess.spawnSync('git', [
            'add',
            addFiles
        ], gitOptions)

        childProcess.spawnSync('git', [
            'commit',
            '-m',
            commitMsg
        ], gitOptions)

        childProcess.spawnSync('git', [
            'push',
            'origin',
            '--force'
        ], gitOptions)

        logger.log('> 已推送至远程仓库')
        resolve()
    })
}
