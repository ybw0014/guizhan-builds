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
            <breadcrumb-item active>
                {{ repo }}
            </breadcrumb-item>
        </breadcrumb>
        <div class="grid grid-cols-1 lg:grid-cols-10 xl:grid-cols-12">
            <div class="col-span-3 xl:col-span-3 m-4">
                <card>
                    <list-group>
                        <list-group-item to="/?tab=all">
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
                    </list-group>
                </card>
            </div>
            <div class="col-span-7 xl:col-span-9 m-4 lg:ml-0">
                <card :title="repo + ' 的所有分支'">
                    <data-table :data="listBranches" :fields="branchesFields">
                        <template #cell(branch)="data">
                            <nuxt-link :to="'/' + user + '/' + repo + '/' + data.value">
                                {{ data.value }}
                            </nuxt-link>
                        </template>
                        <template #cell(status)="data">
                            <build-status :user="data.row.user" :repo="data.row.repo" :branch="data.row.branch" />
                        </template>
                    </data-table>
                </card>
            </div>
        </div>
    </div>
</template>

<script>
import reposUtil from '~/utils/repos'

export default {
    layout: 'main',
    data () {
        return {
            user: this.$route.params.user,
            repo: this.$route.params.repo,
            repos: null,
            branchesFields: [
                {
                    key: 'branch',
                    label: '分支',
                    sortable: true
                },
                {
                    key: 'status',
                    label: '最新构建状态'
                }
            ]
        }
    },
    head () {
        return {
            title: this.repo + ' - ybw0014 的 Maven 构建页面'
        }
    },
    computed: {
        repoInfo () {
            try {
                for (const repoIndex in this.repos) {
                    const repoInfo = this.repos[repoIndex]
                    const user = repoInfo.split('/')[0]
                    if (user !== this.user) {
                        continue
                    }
                    const repo = repoInfo.split('/')[1].split(':')[0]
                    if (repo !== this.repo) {
                        continue
                    }
                    const branch = repoInfo.split(':')[1]
                    return { user, repo, branch }
                }
                return null
            } catch (ex) {
                return null
            }
        },
        listBranches () {
            let lBranches = []
            for (const repoIndex in this.repos) {
                const repoInfo = this.repos[repoIndex]
                const user = repoInfo.split('/')[0]
                if (user !== this.user) {
                    continue
                }
                const repo = repoInfo.split('/')[1].split(':')[0]
                if (repo !== this.repo) {
                    continue
                }
                const branch = repoInfo.split(':')[1]
                lBranches.push({ user, repo, branch })
            }
            return lBranches
        }
    },
    mounted () {
        // repos
        reposUtil.loadRepos(this).then(() => {
            this.repos = reposUtil.getRepos(this)
            if (!reposUtil.exists(this.repos, { user: this.user, repo: this.repo })) {
                this.$nuxt.error({ statusCode: 404, message: 'Not found' })
            }
        })
    },
    methods: {
    }
}
</script>
