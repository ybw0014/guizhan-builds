<template>
    <div>
        <b-breadcrumb class="mb-0">
            <b-breadcrumb-item to="/">
                <b-icon icon="house-fill" scale="1.25" shift-v="1.25" aria-hidden="true" />
                首页
            </b-breadcrumb-item>
            <b-breadcrumb-item :to="'/' + user">
                {{ user }}
            </b-breadcrumb-item>
            <b-breadcrumb-item active>
                {{ repo }}
            </b-breadcrumb-item>
        </b-breadcrumb>
        <div class="container-fluid">
            <div class="row">
                <b-list-group class="col-md-3 pr-0" flush>
                    <b-list-group-item to="/?tab=all">
                        <b-icon icon="arrow-left" />
                        返回仓库列表
                    </b-list-group-item>
                    <b-list-group-item :href="'https://github.com/' + user + '/' + repo" target="_blank">
                        <b-icon icon="github" />
                        项目 GitHub 主页
                    </b-list-group-item>
                    <b-list-group-item :href="'https://github.com/' + user + '/' + repo + '/issues'" target="_blank">
                        <b-icon icon="bug" />
                        问题追踪器
                    </b-list-group-item>
                </b-list-group>
                <div class="col-md-9 pt-2 border-left">
                    <b-tabs content-class="mt-3" lazy>
                        <b-tab :title="repo + ' 的所有分支'">
                            <b-table striped hover :items="listBranches" :fields="branchesFields" head-variant="dark">
                                <template #cell(branch)="data">
                                    <nuxt-link :to="'/' + user + '/' + repo + '/' + data.value">
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
