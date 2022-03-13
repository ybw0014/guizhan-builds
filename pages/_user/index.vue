<template>
    <div>
        <breadcrumb class="mt-2">
            <breadcrumb-item to="/">
                <fa-icon icon="home" aria-hidden="true" />
                首页
            </breadcrumb-item>
            <breadcrumb-item active>
                {{ user }}
            </breadcrumb-item>
        </breadcrumb>
        <div class="grid grid-cols-1 lg:grid-cols-10 xl:grid-cols-12">
            <div class="col-span-3 xl:col-span-3 m-4">
                <card>
                    <list-group item-class="flex items-center">
                        <list-group-item to="/?tab=repos">
                            <fa-icon icon="arrow-left" />
                            返回仓库列表
                        </list-group-item>
                        <list-group-item :href="'https://github.com/' + user" target="_blank">
                            <fa-icon icon="github" type="brands" />
                            访问用户 GitHub 主页
                        </list-group-item>
                    </list-group>
                </card>
            </div>
            <div class="col-span-7 xl:col-span-9 m-4 lg:ml-0">
                <card :title="user + ' 的所有仓库'">
                    <data-table :data="listRepos" :fields="reposFields">
                        <template #cell(repo)="data">
                            <nuxt-link :to="'/' + user + '/' + data.value + '/' + data.row.branch">
                                {{ data.value }}
                            </nuxt-link>
                        </template>
                        <template #cell(status)="data">
                            <build-status :dir="data.row.dir" />
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
            repos: null,
            reposFields: [
                {
                    key: 'repo',
                    label: '项目名称',
                    sortable: true
                },
                {
                    key: 'branch',
                    label: '分支'
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
            title: this.user + ' - ' + this.$consts.title
        }
    },
    computed: {
        listRepos () {
            let lRepos = []
            for (const repoIndex in this.repos) {
                const repoStr = this.repos[repoIndex]
                const repoInfo = reposUtil.getInfoByRepoStr(repoStr)
                const repoSettings = reposUtil.getRepoInfo(this, repoStr)
                repoInfo.dir = reposUtil.getDir(this, repoStr)

                if (repoInfo.user !== this.user) {
                    continue
                }
                if (repoSettings.options?.hidden) {
                    continue
                }

                lRepos.push(repoInfo)
            }
            return lRepos
        }
    },
    mounted () {
        // repos
        reposUtil.loadRepos(this).then(() => {
            this.repos = reposUtil.getRepos(this)
            if (!reposUtil.exists(this.repos, { user: this.user })) {
                this.$nuxt.error({ statusCode: 404, message: 'Not found' })
            }
        })
    },
    methods: {
    }
}
</script>
