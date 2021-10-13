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
        <b-container fluid>
            <b-row>
                <b-list-group class="col-md-3 pr-0" flush>
                    <b-list-group-item to="/?tab=all">
                        <b-icon icon="arrow-left" />
                        返回仓库列表
                    </b-list-group-item>
                    <b-list-group-item :href="'https://github.com/' + user + '/' + repo + '/tree/' + branch" target="_blank">
                        <b-icon icon="github" />
                        项目 GitHub 主页
                    </b-list-group-item>
                    <b-list-group-item :href="'https://github.com/' + user + '/' + repo + '/issues'" target="_blank">
                        <b-icon icon="bug" />
                        问题追踪器
                    </b-list-group-item>
                    <b-list-group-item :href="'/f/' + repoDir + '/badge.svg'" target="_blank">
                        <b-icon icon="cloud" />
                        <build-status :info="{ user, repo, branch }" />
                    </b-list-group-item>
                </b-list-group>
                <b-col md="9" class="pt-2 border-left">
                    <h3 class="repo-name">
                        {{ repo }}
                        <small class="repo-branch">{{ branch }}</small>
                    </h3>
                    <b-container fluid class="mt-4">
                        <b-row>
                            <b-col xs="12" md="8" offset-md="2" class="">
                                <b-card v-if="buildInfo !== null">
                                    <slot name="header">
                                        <h4 class="card-title">
                                            {{ buildTitle }}
                                            <b-icon v-if="buildInfo.success" icon="check-circle-fill" class="text-success" />
                                            <b-icon v-else icon="x-circle-fill" class="text-danger" />
                                        </h4>
                                    </slot>
                                    <b-card-text>
                                        构建于 {{ buildTime }}
                                    </b-card-text>

                                    <b-button :href="'/f/' + repoDir + '/' + buildInfo.target" variant="primary" target="_blank">
                                        从 Github 下载
                                    </b-button>

                                    <b-card class="mt-4 text-center">
                                        <b-card-text>
                                            {{ buildInfo.author }} 于 {{ commitTime }} 提交
                                            (<a :href="'https://github.com/' + user + '/' + repo + '/commit/' + buildInfo.hash" target="_blank">{{ buildInfo.hash.substr(0, 7) }}</a>):
                                        </b-card-text>
                                        <b-card-text>
                                            {{ buildInfo.message }}
                                        </b-card-text>
                                    </b-card>
                                </b-card>
                            </b-col>
                        </b-row>
                    </b-container>
                </b-col>
            </b-row>
        </b-container>
    </div>
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
            build: this.$route.params.build,
            builds: null,
            buildInfo: null,
            buildTitle: '',
            buildTime: '',
            commitTime: ''
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
        try {
            let build = parseInt(this.build)
            if (build.toString() !== this.build.toString()) {
                throw new Error('无效的构建版本')
            }
            this.build = build
        } catch (ex) {
            this.$router.push({
                name: 'user-repo-branch'
            })
        }
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
                    this.$router.push({
                        name: 'user-repo-branch'
                    })
                }

                this.buildInfo = _.find(this.builds, (build) => {
                    return build.id === this.build
                })
                this.buildTitle = '构建 #' + this.buildInfo.id
                this.buildTime = new Date(this.buildInfo.build_timestamp).toLocaleString()
                this.commitTime = new Date(this.buildInfo.timestamp).toLocaleString()
            }).catch(() => {
                this.$nuxt.error({ statusCode: 404, message: 'Not found' })
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
