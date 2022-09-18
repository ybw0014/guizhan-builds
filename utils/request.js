import axios from 'axios'

export default {
    getAnnouncement (lang, folder) {
        return axios.get('/announcement/' + folder + '/' + lang + '.md')
    },
    getRepos () {
        return axios.get('/repos.json')
    },
    getBuilds (repoDir) {
        return axios.get(`/f/${repoDir}/builds.json`)
    }
}
