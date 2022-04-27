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
            <breadcrumb-item active>
                {{ repo }}
            </breadcrumb-item>
        </breadcrumb>
        <div class="grid grid-cols-1 lg:grid-cols-10 xl:grid-cols-12">
            <div class="col-span-3 xl:col-span-3 m-4">
                <card>
                    <list-group item-class="flex items-center">
                        <list-group-item to="/?tab=repos">
                            <fa-icon icon="arrow-left" />
                            {{ $t('pages.repo.back') }}
                        </list-group-item>
                        <list-group-item :href="'https://github.com/' + user + '/' + repo" target="_blank">
                            <fa-icon icon="github" type="brands" />
                            {{ $t('pages.repo.github') }}
                        </list-group-item>
                        <list-group-item :href="'https://github.com/' + user + '/' + repo + '/issues'" target="_blank">
                            <fa-icon icon="bug" />
                            {{ $t('pages.repo.issues') }}
                        </list-group-item>
                    </list-group>
                </card>
            </div>
            <div class="col-span-7 xl:col-span-9 m-4 lg:ml-0">
                <card :title="$t('pages.repo.branches', { repo: repo })">
                    <data-table :data="listBranches" :fields="branchesFields">
                        <template #cell(branch)="data">
                            <nuxt-link :to="'/' + user + '/' + repo + '/' + data.value">
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
            repo: this.$route.params.repo,
            repos: null,
            branchesFields: [
                {
                    key: 'branch',
                    label: 'labels.branch',
                    sortable: true
                },
                {
                    key: 'status',
                    label: 'labels.status'
                }
            ]
        }
    },
    head () {
        return {
            title: this.repo + ' - ' + this.$t('title')
        }
    },
    computed: {
        repoInfo () {
            try {
                for (const repoIndex in this.repos) {
                    const repoStr = this.repos[repoIndex]
                    const repoInfo = reposUtil.getInfoByRepoStr(repoStr)
                    const repoSettings = reposUtil.getRepoInfo(this, repoStr)
                    repoInfo.dir = reposUtil.getDir(this, repoStr)

                    if (repoInfo.user !== this.user) {
                        continue
                    }
                    if (repoInfo.repo !== this.repo) {
                        continue
                    }
                    if (repoSettings.type === 'redirect') {
                        continue
                    }

                    return repoInfo
                }
                return null
            } catch (ex) {
                return null
            }
        },
        listBranches () {
            let lBranches = []
            for (const repoIndex in this.repos) {
                const repoStr = this.repos[repoIndex]
                const repoInfo = reposUtil.getInfoByRepoStr(repoStr)
                const repoSettings = reposUtil.getRepoInfo(this, repoStr)
                repoInfo.dir = reposUtil.getDir(this, repoStr)

                if (repoInfo.user !== this.user) {
                    continue
                }
                if (repoInfo.repo !== this.repo) {
                    continue
                }
                if (repoSettings.options?.hidden) {
                    continue
                }

                lBranches.push(repoInfo)
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
    }
}
</script>
