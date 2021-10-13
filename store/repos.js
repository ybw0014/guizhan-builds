export const state = () => ({
    repos: null,
    users: null
})
export const getters = {
    getRepos (state) {
        return state.repos
    },
    getUsers (state) {
        return state.users
    }
}
export const mutations = {
    setRepos (state, value) {
        state.repos = value
    },
    setUsers (state, value) {
        state.users = value
    }
}
