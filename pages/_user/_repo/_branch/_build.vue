<template>
    <div>
        <breadcrumb class="mt-2">
            <breadcrumb-item to="/">
                <fa-icon icon="home" aria-hidden="true" />
                首页
            </breadcrumb-item>
            <breadcrumb-item :to="'/' + user">
                {{ user }}
            </breadcrumb-item>
            <breadcrumb-item :to="'/' + user + '/' + repo">
                {{ repo }}
            </breadcrumb-item>
            <breadcrumb-item active>
                {{ branch }}
            </breadcrumb-item>
        </breadcrumb>
        <div class="grid grid-cols-1 lg:grid-cols-10 xl:grid-cols-12">
            <div class="col-span-3 xl:col-span-3 m-4">
                <card class="mb-6">
                    <list-group item-class="flex items-center">
                        <list-group-item to="/?tab=repos">
                            <fa-icon icon="arrow-left" />
                            返回仓库列表
                        </list-group-item>
                        <list-group-item :href="'https://github.com/' + user + '/' + repo" target="_blank">
                            <fa-icon icon="github" type="brands" />
                            项目 GitHub 主页
                        </list-group-item>
                        <list-group-item :href="'https://github.com/' + user + '/' + repo + '/issues'" target="_blank">
                            <fa-icon icon="bug" />
                            问题追踪器
                        </list-group-item>
                        <list-group-item :href="'/f/' + repoDir + '/badge.svg'" target="_blank">
                            <fa-icon icon="cloud" />
                            <build-status :user="user" :repo="repo" :branch="branch" />
                        </list-group-item>
                    </list-group>
                </card>
                <collapsable-card title="所有构建">
                    <list-group item-class="flex flex-col items-center">
                        <list-group-item
                            v-for="histBuild in builds"
                            :key="histBuild.id"
                            :to="{ params: {build: histBuild.id} }"
                            class="flex-col"
                        >
                            <span>构建 #{{ histBuild.id }} <build-icon :success="histBuild.success" /></span>
                            <span class="text-sm text-gray-400">{{ new Date(histBuild.build_timestamp).toLocaleString() }}</span>
                        </list-group-item>
                    </list-group>
                </collapsable-card>
            </div>
            <div class="col-span-7 xl:col-span-9 m-4 lg:ml-0">
                <card>
                    <template #title>
                        <span class="repo-name">{{ repo }}</span>
                        <small class="repo-branch">{{ branch }}</small>
                    </template>
                    <div v-if="buildInfo !== null" class="flex flex-col">
                        <p class="text-xl font-bold mb-2">
                            {{ buildTitle }}
                            <build-icon :success="buildInfo.success" />
                        </p>
                        <p>
                            构建于 {{ buildTime }}
                            <a :href="'/f/' + repoDir + '/' + repo + '-' + branch + '-' + buildInfo.id + '.log'" target="_blank">
                                日志
                            </a>
                        </p>
                        <div class="my-4">
                            <a-button :href="'/f/' + repoDir + '/' + buildInfo.target" :disabled="!buildInfo.success" variant="primary" target="_blank" title="由Github Pages + Cloudflare提供下载">
                                直接下载
                            </a-button>
                            <a-button disabled variant="primary" target="_blank">
                                网盘下载(即将推出)
                            </a-button>
                        </div>
                        <p class="mt-3 text-sm">
                            SHA256: {{ buildFileSha256 }}
                        </p>
                        <hr class="my-4">
                        <div class="text-center">
                            <p class="text-gray-500">
                                {{ buildInfo.author }} 于 {{ commitTime }} 提交
                                (<a :href="'https://github.com/' + user + '/' + repo + '/commit/' + buildInfo.commit" target="_blank">{{ buildInfo.commit.substr(0, 7) }}</a>):
                            </p>
                            <p>
                                {{ buildInfo.message }}
                            </p>
                        </div>
                    </div>
                </card>
            </div>
        </div>
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
        },
        buildFileSha256 () {
            return '不可用'
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
                this.builds = buildsUtil.getBuilds(this, this.repoStr, true)
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
    }
}
</script>
<style scoped>
.repo-name{
    @apply font-medium text-3xl;
}
.repo-branch{
    @apply font-thin text-sm;
}
</style>
