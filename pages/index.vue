<template>
    <div>
        <b-breadcrumb class="mb-0">
            <b-breadcrumb-item to="/" active>
                <b-icon icon="house-fill" scale="1.25" shift-v="1.25" aria-hidden="true" />
                首页
            </b-breadcrumb-item>
        </b-breadcrumb>
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-3 pt-2">
                    <h3 class="sidebar-title">
                        <b-icon icon="bell" />
                        公告
                    </h3>
                    <div class="announcement" v-html="announcement" />
                </div>
                <div class="col-md-9 pt-2 border-left">
                    <b-tabs v-model="listTab" content-class="mt-3" lazy>
                        <b-tab title="所有仓库">
                            <b-table striped hover :items="listRepos" :fields="reposFields" head-variant="dark">
                                <template #cell(repo)="data">
                                    <nuxt-link :to="'/' + data.item.user + '/' + data.value + '/' + data.item.branch">
                                        {{ data.value }}
                                    </nuxt-link>
                                </template>
                                <template #cell(user)="data">
                                    <nuxt-link :to="'/' + data.value">
                                        {{ data.value }}
                                    </nuxt-link>
                                </template>
                                <template #cell(status)="data">
                                    <build-status :info="data.item" />
                                </template>
                            </b-table>
                        </b-tab>
                        <b-tab title="所有用户">
                            <b-table striped hover :items="listUsers" :fields="usersFields" head-variant="dark">
                                <template #cell(name)="data">
                                    <nuxt-link :to="'/' + data.value">
                                        {{ data.value }}
                                    </nuxt-link>
                                </template>
                            </b-table>
                        </b-tab>
                    </b-tabs>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import markdown from '@/utils/markdown'
import request from '@/utils/request'
import reposUtil from '@/utils/repos'
export default {
    layout: 'main',
    data: () => {
        return {
            announcement: '公告加载中',
            listTab: 1,
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
        repos () {
            try {
                return this.$store.state.repos.data.repos
            } catch (ex) {
                return null
            }
        },
        users () {
            try {
                return this.$store.state.repos.data.users
            } catch (ex) {
                return null
            }
        },
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
    created() {
        // tab
        if (this.$route.query.tab === 'all') {
            this.listTab = 0
        }
    },
    mounted () {
        // announcement
        request.getAnnouncement()
            .then((response) => {
                this.announcement = markdown.render(response.data)
            })
            .catch(() => {
                this.announcement = '公告加载失败'
            })
        // repos
        if (this.repos == null) {
            request.getRepos()
                .then((response) => {
                    const data = reposUtil.parse(response.data)
                    this.$store.commit('repos/setData', data)
                })
        }
    },
    methods: {
        statusError (e) {
            console.log('k', e)
        }
    }
}
</script>
<style scoped>
.announcement{
    font-weight: 300;
}
.sidebar-title{
    font-size: 1.4rem;
}
</style>
