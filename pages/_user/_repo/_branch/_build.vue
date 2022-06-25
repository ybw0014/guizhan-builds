<template>
    <div>
        <breadcrumb class="mt-2">
            <breadcrumb-item to="/">
                <fa-icon icon="home" aria-hidden="true" />
                {{ $t('nav.home') }}
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
                            {{ $t('pages.branch.back') }}
                        </list-group-item>
                        <list-group-item :href="'https://github.com/' + user + '/' + repo" target="_blank">
                            <fa-icon icon="github" type="brands" />
                            {{ $t('pages.branch.github') }}
                        </list-group-item>
                        <list-group-item :href="'https://github.com/' + user + '/' + repo + '/issues'" target="_blank">
                            <fa-icon icon="bug" />
                            {{ $t('pages.branch.issues') }}
                        </list-group-item>
                        <list-group-item v-if="repoDir !== ''" :href="'/f/' + repoDir + '/badge.svg'" target="_blank">
                            <fa-icon icon="cloud" />
                            <build-status :dir="repoDir" />
                        </list-group-item>
                    </list-group>
                </card>
                <card :title="$t('pages.branch.builds')">
                    <list-group item-class="flex flex-col items-center" class="builds-list">
                        <list-group-item
                            v-for="histBuild in builds"
                            :key="histBuild.id"
                            :to="{ params: {build: histBuild.id} }"
                            class="flex-col"
                        >
                            <span>{{ $t('pages.branch.build', { build: histBuild.id }) }} <build-icon :success="histBuild.success" /></span>
                            <span class="text-sm text-gray-400">{{ new Date(histBuild.build_timestamp).toLocaleString() }}</span>
                        </list-group-item>
                    </list-group>
                </card>
            </div>
            <div class="col-span-7 xl:col-span-9 m-4 lg:ml-0">
                <card class="mb-4">
                    <template #title>
                        <span class="repo-name">{{ repo }}</span>
                        <small class="repo-branch">{{ branch }}</small>
                    </template>
                    <div v-if="buildInfo !== null" class="flex flex-col">
                        <p class="text-xl font-bold mb-2">
                            {{ $t('pages.branch.build', { build: buildInfo.id }) }}
                            <build-icon :success="buildInfo.success" />
                        </p>
                        <p>
                            {{ $t('pages.branch.build_time', { time: buildTime }) }}
                            <a :href="'/f/' + repoDir + '/' + repo + '-' + branch + '-' + buildInfo.id + '.log'" target="_blank">
                                {{ $t('pages.branch.log') }}
                            </a>
                        </p>
                        <div class="my-4">
                            <a-button :href="'/f/' + repoDir + '/' + buildInfo.target" :disabled="!buildInfo.success" variant="primary" target="_blank" :title="$t('pages.branch.download_direct_tip')">
                                {{ $t('pages.branch.download_direct') }}
                            </a-button>
                            <!--a-button disabled variant="primary" target="_blank">
                                {{ $t('pages.branch.download_webdrive') }}
                            </a-button-->
                        </div>
                        <hr class="my-4">
                        <div class="text-center">
                            <p class="text-gray-500">
                                {{ $t('pages.branch.commit_info', { author: buildInfo.author, time: buildTime }) }}
                                (<a :href="'https://github.com/' + user + '/' + repo + '/commit/' + buildInfo.commit" target="_blank">{{ buildInfo.commit.substr(0, 7) }}</a>):
                            </p>
                            <p>
                                {{ buildInfo.message }}
                            </p>
                        </div>
                        <hr class="my-4">
                        <div v-if="dependencyInfo != null" class="">
                            <p class="font-bold text-lg">
                                {{ $t('pages.branch.requirement') }}
                            </p>
                            <table class="dependency-info">
                                <tr v-for="(info, key) in dependencyInfo" :key="key">
                                    <td>{{ key }}</td>
                                    <td v-html="info" />
                                </tr>
                            </table>
                        </div>
                    </div>
                </card>
            </div>
        </div>
    </div>
</template>

<script>
import _ from 'lodash'
import markdown from '~/utils/markdown'
import reposUtil from '~/utils/repos'
import buildsUtil from '~/utils/builds'

export default {
    layout: 'main',
    data () {
        return {
            user: this.$route.params.user,
            repo: this.$route.params.repo,
            branch: this.$route.params.branch,
            repoDir: '',
            repoInfo: null,
            build: this.$route.params.build,
            builds: null,
            buildInfo: null,
            buildTime: '',
            commitTime: '',
            dependencyInfo: null
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
        // 检测版本号是否合法
        try {
            let build = parseInt(this.build)
            if (build.toString() !== this.build.toString()) {
                throw new Error('Invald build number')
            }
            this.build = build
        } catch (ex) {
            this.$router.push({
                name: 'user-repo-branch'
            })
        }
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
                this.builds = buildsUtil.getBuilds(this, this.repoStr)
                if (!buildsUtil.exists(this.builds, { id: this.build })) {
                    this.$router.replace({
                        name: 'user-repo-branch'
                    })
                    return
                }

                this.buildInfo = _.find(this.builds, (build) => {
                    return build.id === this.build
                })
                this.buildTime = new Date(this.buildInfo.build_timestamp).toLocaleString()
                this.commitTime = new Date(this.buildInfo.timestamp).toLocaleString()

                // dependencies
                if (this.repoInfo.dependencies) {
                    let depsInfo = {}
                    for (const dep in this.repoInfo.dependencies) {
                        const depInfo = this.repoInfo.dependencies[dep]
                        for (const v in depInfo) {
                            if (this.buildInfo.id >= v) {
                                depsInfo[dep] = markdown.render(depInfo[v])
                            }
                        }
                    }
                    this.dependencyInfo = depsInfo
                }
            }).catch(() => {
                this.$nuxt.error({ statusCode: 404, message: 'Not found' })
            })
        })
    }
}
</script>
<style lang="scss" scoped>
.repo-name{
    @apply font-medium text-3xl;
}
.repo-branch{
    @apply font-thin text-sm;
}
.builds-list {
    @apply overflow-y-auto;
    max-height: 45vh;
}
.dependency-info {
    @apply border-collapse mt-2;

    td {
        @apply border border-gray-600 px-4 py-2;
        @apply dark:border-gray-400;
    }
}
</style>
