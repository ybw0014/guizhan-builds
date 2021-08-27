import axios from 'axios'

export default {
    getAnnouncement() {
        return axios.get('/announcement.md')
    },
    getRepos() {
        return axios.get('/repos.json')
    }
}
