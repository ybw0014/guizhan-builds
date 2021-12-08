const logger = require('./maven-build/logger')
const main = require('./maven-build/main')

global.status = {
    tasks: {},
    running: true
}

main.start().then(() => {
    logger.log('运行完成')

    process.exit()
})
