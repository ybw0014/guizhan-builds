<template>
    <div class="grid grid-cols-1 lg:grid-cols-10 xl:grid-cols-12">
        <div class="col-span-3 xl:col-span-3 m-4">
            <div class="card">
                <h3 class="text-xl font-bold mb-4">
                    <fa-icon icon="bell" />
                    公告
                </h3>
                <div v-if="announcement === ''" class="flex justify-center items-center">
                    <div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500" />
                </div>
                <div v-else class="announcement" v-html="announcement"></div>
            </div>
        </div>
        <div class="col-span-7 xl:col-span-9 m-4 lg:ml-0">
            <div class="card">
                <div v-if="repos === null" class="flex justify-center items-center">
                    <div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500" />
                </div>
                <div v-else>
                    <ul class="flex items-center mb-4">
                        <li class="tab-title">
                            所有仓库
                        </li>
                        <li class="tab-title">
                            所有用户
                        </li>
                    </ul>
                    <!--grid-js :cols="reposCols" :rows="listRepos" /-->
                </div>
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
            listTab: 1,
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
            reposCols: ['项目名称', '用户', '分支', '最新构建状态'],
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
                    label: '分支'
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
                lRepos.push([repo, user, branch])
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
    created() {
        // tab
        if (this.$route.query.tab === 'all') {
            this.listTab = 0
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
}
.tab-title{
    @apply cursor-pointer py-2 px-4 text-gray-500 border-b-4;
}
</style>
