<template>
    <div />
</template>

<script>
import _ from 'lodash'
import reposUtil from '~/utils/repos'
import buildsUtil from '~/utils/builds'
export default {
    layout: 'main',
    data () {
        return {
            user: this.$route.params.user,
            repo: this.$route.params.repo,
            branch: this.$route.params.branch,
            repoInfo: null,
            repoDir: ''
        }
    },
    head () {
        return {
            title: `${this.repo} (${this.branch}) - ${this.$t('title')}`
        }
    },
    computed: {
        repoStr () {
            return `${this.user}/${this.repo}:${this.branch}`
        }
    },
    mounted () {
        // 获取仓库列表
        reposUtil.loadRepos(this).then(() => {
            let queryOption = {
                user: this.user,
                repo: this.repo,
                branch: this.branch
            }

            // 查询仓库是否存在
            if (!reposUtil.exists(reposUtil.getRepos(this), queryOption)) {
                this.$nuxt.error({ statusCode: 404, message: 'Not found' })
                return
            }

            // 获取仓库配置
            this.repoInfo = reposUtil.getRepoInfo(this, this.repoStr)
            // 检测重定向
            if (this.repoInfo.type === 'redirect') {
                let params = reposUtil.getInfoByRepoStr(this.repoInfo.options.repo)
                this.$router.replace({
                    name: 'user-repo-branch',
                    params
                })
                return
            }

            // 获取工作目录
            this.repoDir = reposUtil.getDir(this, this.repoStr)
            // 加载构建列表
            buildsUtil.loadBuilds(this, this.repoStr, this.repoDir).then(() => {
                let builds = buildsUtil.getBuilds(this, this.repoStr)
                let foundSuccessfulBuild = false
                _.forEach(builds, (build) => {
                    if (build.success) {
                        foundSuccessfulBuild = true
                        this.$router.replace({
                            name: 'user-repo-branch-build',
                            params: { build: build.id }
                        })
                        return false
                    }
                })

                if (!foundSuccessfulBuild) {
                    // 未搜寻到最新的成功构建，则显示最新构建
                    this.$router.replace({
                        name: 'user-repo-branch-build',
                        params: { build: _.first(builds).id }
                    })
                }
            }).catch(() => {
                this.$nuxt.error({ statusCode: 404, message: 'Not found' })
            })
        })
    }
}
</script>
