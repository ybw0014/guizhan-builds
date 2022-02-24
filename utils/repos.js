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
                    for (const repo in response.data) {
                        repos.push(repo)
                        let user = repo.split('/')[0]
                        if (user in users) {
                            users[user]++
                        } else {
                            users[user] = 1
                        }
                    }
                    vueInst.$store.commit('repos/setRepos', repos)
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
     * @returns {any}
     */
    getRepos (vueInst) {
        return vueInst.$store.getters['repos/getRepos']
    },

    /**
     * 从state中获取users
     * @param vueInst vue实例
     * @returns {any}
     */
    getUsers (vueInst) {
        return vueInst.$store.getters['repos/getUsers']
    },

    /**
     * repos中是否存在指定项
     * @param repos {Array<String>} repos
     * @param options {Object} 搜索选项
     * @returns {boolean} 是否存在
     */
    exists (repos, options) {
        let found = false
        _.forEach(repos, (repo) => {
            if (!_.isNil(options.user) && options.user !== repo.split('/')[0]) {
                return true // continue
            }
            if (!_.isNil(options.repo) && options.repo !== repo.split('/')[1].split(':')[0]) {
                return true // continue
            }
            if (!_.isNil(options.branch) && options.branch !== repo.split(':')[1]) {
                return true // continue
            }
            found = true
            return false // break
        })
        return found
    }
}
