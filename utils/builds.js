import _ from 'lodash'
import request from './request'

export default {
    /**
     * 加载 builds
     * @param vueInst vue实例
     * @param repoStr {string} 仓库名称 (user/repo:branch)
     * @param repoDir {string} 仓库目录 (user/repo/branch)
     * @returns {Promise} 加载成功则resolve, 否则reject
     */
    loadBuilds(vueInst, repoStr, repoDir) {
        return new Promise((resolve, reject) => {
            if (_.isNil(vueInst.$store.getters['builds/getBuilds'](repoStr))) {
                request.getBuilds(repoDir).then((response) => {
                    // get latest and builds
                    vueInst.$store.commit('builds/setLatest', { repoStr, latest: response.data.latest })
                    vueInst.$store.commit('builds/setBuilds', { repoStr, builds: response.data.builds })
                    resolve()
                }).catch(reject)
            } else {
                resolve()
            }
        })
    },
    /**
     * 从state中获取latest
     * @param vueInst vue实例
     * @param repoStr {string} 仓库名称 (user/repo:branch)
     * @returns {int} latest时间戳
     */
    getLatest(vueInst, repoStr) {
        return vueInst.$store.getters['builds/getLatest'](repoStr)
    },
    /**
     * 从state中获取builds
     * @param vueInst vue实例
     * @param repoStr {string} 仓库名称 (user/repo:branch)
     * @returns {Array<Object>} builds列表
     */
    getBuilds(vueInst, repoStr) {
        return vueInst.$store.getters['builds/getBuilds'](repoStr)
    },
    /**
     * builds中是否存在指定项
     * @param builds {Array<String>} builds
     * @param options {Object} 搜索选项
     * @returns {boolean} 是否存在
     */
    exists(builds, options) {
        let found = false
        _.forEach(builds, (build) => {
            if (!_.isNil(options.id) && options.id.toString() !== build.id.toString()) {
                return true // continue
            }
            if (!_.isNil(options.commit) && options.commit !== build.commit) {
                return true // continue
            }
            if (!_.isNil(options.timestamp) && options.timestamp !== build.timestamp) {
                return true // continue
            }
            found = true
            return false // break
        })
        return found
    }
}
