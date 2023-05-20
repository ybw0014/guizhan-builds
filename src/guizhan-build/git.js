/**
 * 与本地 Git 有关方法（但不是 GitHub）
 * @author ybw0014
 */

const path = require('path')
const childProcess = require('child_process')

const config = require('./config')

module.exports = {
    init,
    run
}

const gitOptions = {
    cwd: path.resolve(__dirname, '../../'),
    env: process.env,
    stdio: [process.stdin, process.stdout, process.stderr],
    encoding: 'utf-8'
}

function init() {
    childProcess.spawnSync('git', [
        'config',
        'user.name',
        config.bot_name
    ], gitOptions)
    childProcess.spawnSync('git', [
        'config',
        'user.name',
        config.bot_email
    ], gitOptions)
    childProcess.spawnSync('git', [
        'remote',
        'set-url',
        'origin',
        `https://${config.bot_token}@github.com/ybw0014/guizhan-builds.git`
    ], gitOptions)
}

/**
 * 根据提供的参数执行git
 */
function run(args) {
    return childProcess.spawnSync('git', args, gitOptions)
}
