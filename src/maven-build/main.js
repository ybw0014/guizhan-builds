const projects = require('./projects.js')

module.exports = {
    start() {
        return new Promise((resolve, reject) => {
            console.log('Loading projects')

            projects.getProjects()
        })
    }
}
