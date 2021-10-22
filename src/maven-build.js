const main = require('./maven-build/main')

global.status = {
    tasks: {},
    running: true
}

main.start().then(() => {
    console.log('运行完成')

    process.exit()
})
