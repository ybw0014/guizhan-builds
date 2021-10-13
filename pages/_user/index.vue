<template>
    <div>
        <b-breadcrumb class="mb-0">
            <b-breadcrumb-item to="/">
                <b-icon icon="house-fill" scale="1.25" shift-v="1.25" aria-hidden="true" />
                首页
            </b-breadcrumb-item>
            <b-breadcrumb-item active>
                {{ user }}
            </b-breadcrumb-item>
        </b-breadcrumb>
        <div class="container-fluid">
            <div class="row">
                <b-list-group class="col-md-3 pr-0" flush>
                    <b-list-group-item to="/?tab=all">
                        <b-icon icon="arrow-left" />
                        返回仓库列表
                    </b-list-group-item>
                    <b-list-group-item :href="'https://github.com/' + user" target="_blank">
                        <b-icon icon="github" />
                        访问用户 GitHub 主页
                    </b-list-group-item>
                </b-list-group>
                <div class="col-md-9 pt-2 border-left">
                    <b-tabs content-class="mt-3">
                        <b-tab :title="user + ' 的所有仓库'" active>
                            <b-table striped hover :items="listRepos" :fields="reposFields" head-variant="dark">
                                <template #cell(repo)="data">
                                    <nuxt-link :to="'/' + user + '/' + data.value + '/' + data.item.branch">
                                        {{ data.value }}
                                    </nuxt-link>
                                </template>
                                <template #cell(status)="data">
                                    <build-status :info="data.item" />
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
            title: this.user + ' - ybw0014 的 Maven 构建页面'
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
