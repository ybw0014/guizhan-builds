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
                <div class="col-md-3 pt-2 announcement" v-html="announcement"></div>
                <div class="col-md-9 pt-2 border-left">
                    <b-tabs v-model="listTab" content-class="mt-3" lazy>
                        <b-tab title="所有仓库">
                            <b-table striped hover :items="listRepos"></b-table>
                        </b-tab>
                        <b-tab title="所有用户">
                            <b-table striped hover :items="listUsers" :fields="usersFields">
                                <template #cell(name)="data">
                                    <nuxt-link :to="'/' + data.value">{{ data.value }}</nuxt-link>
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
export default {
    layout: 'main',
    data: () => {
        return {
            announcement: '公告加载中',
            listTab: 1,
            repos: [],
            users: [],
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
            ]
        }
    },
    computed: {
        listRepos () {
            let lRepos = []
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
    methods: {
        //
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
        request.getRepos()
            .then((response) => {
                const repos = response.data
                let users = []
                for (const repo in repos) {
                    this.repos.push(repo)
                    const user = repo.split('/')[0]
                    if (!users.includes(user)) {
                        users[user] = 1
                    } else {
                        users[user]++
                    }
                }
                this.users = users
            })
    }
}
</script>
<style scoped>
.announcement{
    font-weight: 300;
}
</style>
