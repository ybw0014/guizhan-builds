import projects from './projects'

export default {
    start() {
        return new Promise((resolve, reject) => {
            console.log("Loading projects")

            projects.getProjects()
        })
    }
}
