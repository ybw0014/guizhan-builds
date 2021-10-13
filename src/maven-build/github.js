/**
 * 有关 Github 的所有方法
 * @author ybw0014
 */

const path = require('path')
const childProcess = require('child_process')

const projects = require('./projects')
const request = require('./request')
request.defaults.baseURL = 'https://api.github.com/'

module.exports = {
    /**
     * 获取任务仓库的最新commit
     * @param task 任务
     * @returns {Promise} 包含最新commit
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
                console.log('> 已获取最新commit')
                resolve(response.data[0])
            }).catch(reject)
        })
    },
    /**
     * 克隆仓库并重制到任务commit
     * @param task 任务
     * @returns {Promise} 如果任务均执行成功则resolve
     */
    clone(task) {
        return new Promise((resolve, reject) => {
            let dir = projects.getWorkingDirectory(task)

            console.log('> 正在克隆仓库')

            const gitClone = childProcess.spawn('git', [
                'clone',
                'https://github.com/' + task.user + '/' + task.repo + '.git',
                dir,
                '-b', task.branch,
                '--single-branch'
            ])

            gitClone.stdout.on('data', (data) => {
                console.log('git> ' + data)
            })
            gitClone.stderr.on('data', (data) => {
                console.log('git> ' + data)
            })

            gitClone.on('close', () => {
                console.log('> 已克隆仓库,正在将分支重置到commit:', task.commit.hash)

                const gitReset = childProcess.spawn('git', [
                    'reset',
                    '--hard',
                    task.commit.hash
                ], {
                    cwd: dir
                })

                gitReset.stdout.on('data', (data) => {
                    console.log('git> ' + data)
                })
                gitReset.stderr.on('data', (data) => {
                    console.log('git> ' + data)
                })

                gitReset.on('close', () => {
                    console.log('> 已重置该分支')
                    resolve()
                })
            })
        })
    },
    /**
     * 推送任务更改
     * @param task 任务
     * @returns {Promise<unknown>}
     */
    pushChanges(task) {
        return new Promise((resolve, reject) => {
            console.log('> 推送更改')

            let addFiles = path.resolve(projects.getWorkingDirectory(task), '../') + '/*'
            let commitMsg = (task.success ? '构建成功: ' : '构建失败: ') + task.directory + ' (' + task.version + ')'

            console.log(`>> git add ${addFiles}`)
            let gitAdd = childProcess.spawnSync('git', [
                'add',
                addFiles
            ])
            console.log('git > ', gitAdd.stdout.toString())
            console.log('git > ', gitAdd.stderr.toString())

            console.log(`>> git commit -m "${commitMsg}"`)
            let gitCommit = childProcess.spawnSync('git', [
                'commit',
                '-m',
                commitMsg
            ])
            console.log('git > ', gitCommit.stdout.toString())
            console.log('git > ', gitCommit.stderr.toString())

            console.log('>> git push origin --force')
            let gitPush = childProcess.spawnSync('git', ['push', 'origin', '--force'])
            console.log('git > ', gitPush.stdout.toString())
            console.log('git > ', gitPush.stderr.toString())

            console.log('> 已推送至远程仓库')
            resolve()
        })
    }
}
