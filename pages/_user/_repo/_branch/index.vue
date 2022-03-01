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
            branch: this.$route.params.branch
        }
    },
    head () {
        return {
            title: `${this.repo}(${this.branch}) - ybw0014 的 Maven 构建页面`
        }
    },
    computed: {
        repoDir () {
            return `${this.user}/${this.repo}/${this.branch}`
        },
        repoStr () {
            return `${this.user}/${this.repo}:${this.branch}`
        }
    },
    mounted () {
        // repos
        reposUtil.loadRepos(this).then(() => {
            let queryOption = {
                user: this.user,
                repo: this.repo,
                branch: this.branch
            }
            if (!reposUtil.exists(reposUtil.getRepos(this), queryOption)) {
                this.$nuxt.error({ statusCode: 404, message: 'Not found' })
                return
            }
            buildsUtil.loadBuilds(this, this.repoStr, this.repoDir).then(() => {
                let builds = buildsUtil.getBuilds(this, this.repoStr)
                this.$router.push({
                    name: 'user-repo-branch-build',
                    params: { build: _.last(builds).id }
                })
            }).catch(() => {
                this.$nuxt.error({ statusCode: 404, message: 'Not found' })
            })
        })
    }
}
</script>
