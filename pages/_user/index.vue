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
                    <list-group>
                        <list-group-item to="/?tab=all">
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
                const repoInfo = this.repos[repoIndex]
                const user = repoInfo.split('/')[0]
                if (user !== this.user) {
                    continue
                }
                const repo = repoInfo.split('/')[1].split(':')[0]
                const branch = repoInfo.split(':')[1]
                lRepos.push({ repo, user, branch })
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
