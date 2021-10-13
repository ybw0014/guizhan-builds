export const state = () => ({
    latest: {},
    builds: {}
})
export const getters = {
    getLatest: state => (repoStr) => {
        return state.latest[repoStr]
    },
    getBuilds: state => (repoStr) => {
        return state.builds[repoStr]
    }
}
export const mutations = {
    setLatest (state, payload) {
        state.latest[payload.repoStr] = payload.latest
    },
    setBuilds (state, payload) {
        state.builds[payload.repoStr] = payload.builds
    }
}
