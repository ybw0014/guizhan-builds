<template>
    <div>
        <b-breadcrumb class="mb-0">
            <b-breadcrumb-item to="/">
                <b-icon icon="house-fill" scale="1.25" shift-v="1.25" aria-hidden="true" />
                首页
            </b-breadcrumb-item>
            <b-breadcrumb-item :to="'/' + user">
                {{ user }}
            </b-breadcrumb-item>
            <b-breadcrumb-item :to="'/' + user + '/' + repo">
                {{ repo }}
            </b-breadcrumb-item>
            <b-breadcrumb-item active>
                {{ branch }}
            </b-breadcrumb-item>
        </b-breadcrumb>
        <div class="container-fluid">
            <div class="row">
                <b-list-group class="col-md-3 pr-0" flush>
                    <b-list-group-item to="/?tab=all">
                        <b-icon icon="arrow-left" />
                        返回仓库列表
                    </b-list-group-item>
                    <b-list-group-item :href="'https://github.com/' + user + '/' + repo" target="_blank">
                        <b-icon icon="github" />
                        项目 GitHub 主页
                    </b-list-group-item>
                    <b-list-group-item :href="'https://github.com/' + user + '/' + repo + '/issues'" target="_blank">
                        <b-icon icon="bug" />
                        问题追踪器
                    </b-list-group-item>
                </b-list-group>
                <div class="col-md-9 pt-2 border-left">
                    <h3 class="repo-name">
                        {{ repo }}
                        <small class="repo-branch">{{ branch }}</small>
                    </h3>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import reposUtil from '~/utils/repos'
import buildsUtil from '~/utils/builds'
export default {
    layout: 'main',
    data () {
        return {
            user: this.$route.params.user,
            repo: this.$route.params.repo,
            branch: this.$route.params.branch,
            build: this.$route.params.build,
            builds: null
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
            }
            buildsUtil.loadBuilds(this, this.repoStr, this.repoDir).then(() => {
                this.builds = buildsUtil.getBuilds(this, this.repoStr)
                if (!buildsUtil.exists(this.builds, { id: this.build })) {
                    this.$nuxt.error({ statusCode: 404, message: 'Not found' })
                }
            })
        })
    },
    methods: {
    }
}
</script>
<style scoped>
.repo-name{
    font-weight: 500;
    font-size: 1.8rem;
}
.repo-branch{
    font-weight: 300;
    font-size: 0.9rem;
}
</style>
