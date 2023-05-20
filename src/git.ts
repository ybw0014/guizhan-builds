/**
 * 与本地 Git 有关方法
 * @author ybw0014
 */

import path from 'path'
import { spawnSync, SpawnSyncOptions } from 'child_process'

import config from './config'

const gitOptions: SpawnSyncOptions = {
    cwd: path.resolve(__dirname, '../../'),
    env: process.env,
    stdio: [process.stdin, process.stdout, process.stderr],
    encoding: 'utf-8'
}

function init() {
    run(['config', 'user.name', config.bot_name])
    run(['config', 'user.name', config.bot_email])
    run(['remote', 'set-url', 'origin', `https://${config.bot_token}@github.com/ybw0014/guizhan-builds.git`])
}

/**
 * 根据提供的参数执行git
 */
function run(args: string[]) {
    return spawnSync('git', args, gitOptions)
}

export default {
    init,
    run
}
