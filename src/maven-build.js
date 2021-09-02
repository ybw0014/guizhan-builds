import main from './maven-build/main'

global.status = {
    task: {},
    running: true
}

main.start(true).then(() => {
    console.log('Run completed.')

    process.exit()
})
