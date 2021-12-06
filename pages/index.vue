<template>
    <div>
        <breadcrumb class="mt-2">
            <breadcrumb-item active>
                <fa-icon icon="home" aria-hidden="true" />
                首页
            </breadcrumb-item>
        </breadcrumb>
        <div class="grid grid-cols-1 lg:grid-cols-10 xl:grid-cols-12">
            <div class="col-span-3 xl:col-span-3 m-4">
                <card>
                    <template #title>
                        <fa-icon icon="bell" />
                        公告
                    </template>

                    <div v-if="announcement === ''" class="flex justify-center items-center">
                        <div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500" />
                    </div>
                    <div v-else v-lazy-load="announcement" class="announcement" />
                </card>
            </div>
            <div class="col-span-7 xl:col-span-9 m-4 lg:ml-0">
                <card>
                    <div v-if="repos === null" class="flex justify-center items-center">
                        <div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500" />
                    </div>
                    <tabs v-else>
                        <tab key="repos" :active="selectedTab === 'repos'" title="所有仓库">
                            <data-table :fields="reposFields" :data="listRepos">
                                <template #cell(repo)="data">
                                    <nuxt-link :to="'/' + data.row.user + '/' + data.row.repo + '/' + data.row.branch">
                                        {{ data.value }}
                                    </nuxt-link>
                                </template>
                                <template #cell(user)="data">
                                    <nuxt-link :to="'/' + data.row.user">
                                        {{ data.value }}
                                    </nuxt-link>
                                </template>
                                <template #cell(status)="data">
                                    <build-status :user="data.row.user" :repo="data.row.repo" :branch="data.row.branch" />
                                </template>
                            </data-table>
                        </tab>
                        <tab key="users" :active="selectedTab === 'users'" title="所有用户">
                            <data-table :fields="usersFields" :data="listUsers">
                                <template #cell(name)="data">
                                    <nuxt-link :to="'/' + data.value">
                                        {{ data.value }}
                                    </nuxt-link>
                                </template>
                            </data-table>
                        </tab>
                    </tabs>
                </card>
            </div>
        </div>
    </div>
</template>

<script>
import markdown from '~/utils/markdown'
import request from '~/utils/request'
import reposUtil from '~/utils/repos'

export default {
    layout: 'main',
    data: () => {
        return {
            announcement: '',
            selectedTab: 'users',
            repos: null,
            users: null,
            usersFields: [
                {
                    key: 'name',
                    label: '用户',
                    sortable: true
                },
                {
                    key: 'amount',
                    label: '仓库数量',
                    sortable: true
                }
            ],
            reposFields: [
                {
                    key: 'repo',
                    label: '项目名称',
                    sortable: true
                },
                {
                    key: 'user',
                    label: '用户'
                },
                {
                    key: 'branch',
                    label: '分支',
                    headerClass: '',
                    contentClass: ''
                },
                {
                    key: 'status',
                    label: '最新构建状态'
                }
            ]
        }
    },
    computed: {
        listRepos () {
            let lRepos = []
            for (const repoIndex in this.repos) {
                const repoInfo = this.repos[repoIndex]
                const user = repoInfo.split('/')[0]
                const repo = repoInfo.split('/')[1].split(':')[0]
                const branch = repoInfo.split(':')[1]
                lRepos.push({ repo, user, branch })
            }
            return lRepos
        },
        listUsers () {
            let lUsers = []
            for (const user in this.users) {
                lUsers.push({ name: user, amount: this.users[user] })
            }
            return lUsers
        }
    },
    created () {
        // tab
        if (this.$route.query.tab === 'repos') {
            this.selectedTab = 'repos'
        }
    },
    mounted () {
        // announcement
        request.getAnnouncement(this)
            .then((response) => {
                this.announcement = markdown.render(response.data)
            })
            .catch(() => {
                this.announcement = '公告加载失败'
            })
        // repos
        reposUtil.loadRepos(this).then(() => {
            this.repos = reposUtil.getRepos(this)
            this.users = reposUtil.getUsers(this)
        })
    },
    methods: {
    }
}
</script>
<style lang="scss" scoped>
.announcement{
    @apply font-light;
    @apply dark:text-gray-100;

    &::v-deep {
        p {
            @apply mb-4;
        }
    }
}
</style>
