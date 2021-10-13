import axios from 'axios'

export default {
    getAnnouncement() {
        return axios.get('/announcement.md')
    },
    getRepos() {
        return axios.get('/repos.json')
    },
    getBuilds(repoDir) {
        return axios.get(`/f/${repoDir}/builds.json`)
    }
}
