const logger = require('./guizhan-build/logger')
const main = require('./guizhan-build/main')

global.status = {
    tasks: {},
    running: true
}

main.start().then(() => {
    logger.log('运行完成')

    process.exit()
})
