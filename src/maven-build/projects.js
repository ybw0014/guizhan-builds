const fileSystem = require('fs')
const fs = fileSystem.promises
const path = require('path')

module.exports = {
    getProjects() {
        return new Promise((resolve, reject) => {
            fs.readFile(path.resolve('../static/repos.json'))
                .then((repos) => {
                    const jobs = []
                    const json = JSON.parse(repos)

                    for (const repo in json) {
                        console.log(`> Loaded project ${repo}`)

                        let jobInfo = {
                            user: repo.split('/')[0],
                            repo: repo.split('/')[1].split(':')[0],
                            branch: repo.split(':')[1]
                        }

                        jobInfo.directory = jobInfo.user + '/' + jobInfo.repo + '/' + jobInfo.branch

                        if (json[repo].options) {
                            jobInfo.options = json[repo].options
                        }

                        jobs.push(jobInfo)
                    }

                    resolve(jobs)
                }, reject)
        })
    }
}
