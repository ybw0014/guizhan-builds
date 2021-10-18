const core = require('@actions/core')
const main = require('./maven-build/main')

global.status = {
    tasks: {},
    running: true,
    hasUpdate: false
}

main.start().then(() => {
    console.log('运行完成')
    core.setOutput('HAS_UPDATE', global.status.hasUpdate)

    process.exit()
})
