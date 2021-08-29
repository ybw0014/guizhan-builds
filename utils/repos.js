export default {
    parse (rawRepos) {
        let repos = []
        let users = []
        for (const repo in rawRepos) {
            repos.push(repo)
            const user = repo.split('/')[0]
            if (!(user in users)) {
                users[user] = 1
            } else {
                users[user]++
            }
        }
        return { repos, users }
    }
}
