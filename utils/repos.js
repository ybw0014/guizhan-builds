import _ from 'lodash'
import request from './request'

export default {
    /**
     * 加载 repos
     * @param vueInst vue实例
     * @returns {Promise} 加载成功则resolve, 否则reject
     */
    loadRepos (vueInst) {
        return new Promise((resolve, reject) => {
            if (_.isNil(vueInst.$store.getters['repos/getRepos'])) {
                request.getRepos().then((response) => {
                    // get repos and users
                    let repos = []
                    let users = []
                    let reposInfo = {}
                    for (const repo in response.data) {
                        repos.push(repo)
                        reposInfo[repo] = response.data[repo]
                        let user = repo.split('/')[0]
                        // 检查是否为隐藏/重定向仓库
                        if (reposInfo[repo].options?.hidden || reposInfo[repo].type === 'redirect') {
                            continue
                        }
                        if (user in users) {
                            users[user]++
                        } else {
                            users[user] = 1
                        }
                    }
                    vueInst.$store.commit('repos/setRepos', repos)
                    vueInst.$store.commit('repos/setReposInfo', reposInfo)
                    vueInst.$store.commit('repos/setUsers', users)
                    resolve()
                })
            } else {
                resolve()
            }
        })
    },

    /**
     * 从state中获取repos
     * @param vueInst vue实例
     * @returns {Array<String>} repos
     */
    getRepos (vueInst) {
        return vueInst.$store.getters['repos/getRepos']
    },

    /**
     * 从state中获取users
     * @param vueInst vue实例
     * @returns {Array<String>} users
     */
    getUsers (vueInst) {
        return vueInst.$store.getters['repos/getUsers']
    },

    /**
     * 根据仓库字符串获得仓库信息
     * @param repoStr{String} 仓库字符串
     * @returns {Object<String>} 仓库信息
     */
    getInfoByRepoStr (repoStr) {
        let splitByBranch = repoStr.split(':')
        let splitByRepo = splitByBranch[0].split('/')
        let user = splitByRepo[0]
        let repo = splitByRepo[1]
        let branch = splitByBranch[1]

        return { user, repo, branch }
    },

    /**
     * repos中是否存在指定项
     * @param repos {Array<String>} repos
     * @param options {Object} 搜索选项
     * @returns {boolean} 是否存在
     */
    exists (repos, options) {
        let found = false
        _.forEach(repos, (repoStr) => {
            let { user, repo, branch } = this.getInfoByRepoStr(repoStr)
            if (!_.isNil(options.user) && options.user !== user) {
                return true // continue
            }
            if (!_.isNil(options.repo) && options.repo !== repo) {
                return true // continue
            }
            if (!_.isNil(options.branch) && options.branch !== branch) {
                return true // continue
            }
            found = true
            return false // break
        })
        return found
    },

    /**
     * 获取仓库信息
     * @param vueInst vue实例
     * @param repoStr{String} 仓库字符串
     * @returns {Object} 仓库类型
     */
    getRepoInfo (vueInst, repoStr) {
        return vueInst.$store.getters['repos/getReposInfo'][repoStr]
    },

    /**
     * 获取仓库工作目录
     * @param vueInst vue实例
     * @param repoStr{String} 仓库字符串
     * @returns {String} 仓库工作目录
     */
    getDir (vueInst, repoStr) {
        let directory = this.getRepoInfo(vueInst, repoStr).options?.customDir
        if (_.isNil(directory)) {
            let { user, repo, branch } = this.getInfoByRepoStr(repoStr)
            return `${user}/${repo}/${branch}`
        } else {
            return directory
        }
    }
}
