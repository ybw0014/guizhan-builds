import fs from 'fs'
import path from 'path'

export default {
    getProjects() {
        return new Promise((resolve, reject) => {
            fs.promises.readFile(path.resolve('@/repos.json'))
                .then((repos) => {
                    const json = JSON.parse(repos)
                    console.log(json)
                }, reject)
        })
    }
}
