export const state = () => ({
    repos: null
})

export const mutations = {
    setRepos(state, repos){
        state.repos = repos
    }
}