/**
 * 项目配置文件
 * @author ybw0014
 */

const _ = require('lodash')

module.exports = {
    dry_run: process.env.DRY_RUN === 'true', // 是否为测试模式
    bot_name: process.env.BOT_USERNAME, // 机器人的Git用户名
    bot_email: process.env.BOT_EMAIL, // 机器人的Git邮箱
    bot_token: process.env.BOT_TOKEN, // 机器人的GitHub Token
    path_cwd: process.cwd(), // 当前工作目录
    path_projects: './static/f', // 项目信息存储目录
    path_project_workspace: './workspace', // 项目在有新版本时的工作目录
    path_repos: !_.isNil(process.env.REPOS_PATH) ? process.env.REPOS_PATH : './static/repos.json', // repos.json文件路径(相对于当前目录)
    github_api: 'https://api.github.com/' // GitHub API地址
}
