import axios from 'axios'

export default {
    getAnnouncement (lang) {
        return axios.get('/announcement/' + lang + '.md')
    },
    getRepos () {
        return axios.get('/repos.json')
    },
    getBuilds (repoDir) {
        return axios.get(`/f/${repoDir}/builds.json`)
    }
}
