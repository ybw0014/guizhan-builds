export const state = () => ({
    repos: null,
    users: null,
    reposInfo: null
})
export const getters = {
    getRepos (state) {
        return state.repos
    },
    getReposInfo (state) {
        return state.reposInfo
    },
    getUsers (state) {
        return state.users
    }
}
export const mutations = {
    setRepos (state, value) {
        state.repos = value
    },
    setReposInfo (state, value) {
        state.reposInfo = value
    },
    setUsers (state, value) {
        state.users = value
    }
}
