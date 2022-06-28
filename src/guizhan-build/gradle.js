/**
 * 有关 Gradle 的所有方法
 * @author ybw0014
 */

const fileSystem = require('fs')
const fs = fileSystem.promises
const path = require('path')
const childProcess = require('child_process')

const logger = require('./logger')
const projects = require('./projects')

module.exports = {
    setVersion,
    build,
    relocateTarget
}

/**
 * 设置输出版本
 * @param task 任务
 * @returns {Promise} 设置成功则resolve
 */
function setVersion (task) {
    return new Promise((resolve, reject) => {
        task.finalName = task.options.target.name + '-' + task.finalVersion
        Promise.all([
            removeVersionFromBuild(task),
            setProperties(task),
            setSettings(task)
        ]).then(resolve, reject)
    })
}

/**
 * 从 build.gradle 中移除版本信息
 * @param task 任务
 * @returns {Promise}
 */
function removeVersionFromBuild (task) {
    const buildGradle = task.options.kotlin ? 'build.gradle.kts' : 'build.gradle'
    const buildPath = path.resolve(projects.getWorkingDirectory(task), './' + buildGradle)

    return new Promise((resolve, reject) => {
        fs.readFile(buildPath, 'utf-8').then((config) => {
            let newConfig = config
                .replace('\r\n', '\n')
                .split('\n')
                .filter((value, index) => {
                    return !value.startsWith('version')
                })
                .join('\n')

            fs.writeFile(buildPath, newConfig, 'utf8').then(resolve, reject)
        }, reject)
    })
}

/**
 * 设置 gradle.properties 中的版本号
 * @param task 任务
 * @returns {Promise}
 */
function setProperties (task) {
    const propertiesPath = path.resolve(projects.getWorkingDirectory(task), './gradle.properties')
    const line = 'version = ' + task.finalVersion

    return new Promise((resolve, reject) => {
        if (fileSystem.existsSync(propertiesPath)) {
            fs.readFile(propertiesPath, 'utf-8').then((config) => {
                let newConfigs = config
                    .replace('\r\n', '\n')
                    .split('\n')
                    .filter((value, index) => {
                        return !value.startsWith('version')
                    })

                newConfigs.push(line)

                let newConfig = newConfigs.join('\n')

                fs.writeFile(propertiesPath, newConfig, 'utf8').then(resolve, reject)
            }, reject)
        } else {
            let newConfig = line + '\n'
            fs.writeFile(propertiesPath, newConfig, 'utf8').then(resolve, reject)
        }
    })
}

/**
 * 设置 settings.gradle 中的项目名称
 * @param task 任务
 * @returns {Promise}
 */
function setSettings (task) {
    const settingsPath = path.resolve(projects.getWorkingDirectory(task), './settings.gradle')
    const line = 'rootProject.name = \'' + task.options.target.name + '\''

    return new Promise((resolve, reject) => {
        if (fileSystem.existsSync(settingsPath)) {
            fs.readFile(settingsPath, 'utf-8').then((config) => {
                let newConfigs = config
                    .replace('\r\n', '\n')
                    .split('\n')
                    .filter((value, index) => {
                        return !value.startsWith('rootProject.name')
                    })

                newConfigs.push(line)
                let newConfig = newConfigs.join('\n')

                fs.writeFile(settingsPath, newConfig, 'utf8').then(resolve, reject)
            }, reject)
        } else {
            let newConfig = line + '\n'
            fs.writeFile(settingsPath, newConfig, 'utf8').then(resolve, reject)
        }
    })
}

/**
 * 构建任务项目
 * @param task 任务
 * @returns {Promise}
 */
function build (task) {
    return new Promise((resolve, reject) => {
        logger.log('> 构建项目: ' + task.directory)

        let dir = projects.getWorkingDirectory(task)
        let logBranch = task.branch.replace('/', '-')
        let logFilename = path.resolve(dir, `../${task.repo}-${logBranch}-${task.version}.log`)
        let logFile = fileSystem.openSync(logFilename, 'w')

        // arguments
        let args = ['clean', 'build']
        if (task.options.gradle && task.options.gradle.shadowJar) {
            args.push('shadowJar')
        }

        let gradleOptions = {
            cwd: dir,
            env: process.env,
            stdio: [process.stdin, logFile, logFile],
            encoding: 'utf-8'
        }

        // Call gradle wrapper
        childProcess.spawnSync('./gradlew', args, gradleOptions)
        resolve()
    })
}

/**
 * 将构建目标文件移动
 * @param task 任务
 * @returns {Promise} 总是resolve
 */
function relocateTarget (task) {
    if (!task.success) {
        return Promise.resolve()
    }

    let dir = projects.getWorkingDirectory(task)
    let buildName = task.finalName
    if (task.options.gradle && task.options.gradle.shadowJar) {
        buildName += '-all'
    }
    buildName += '.jar'

    let src = path.resolve(dir, './build/libs/', `${buildName}`)

    return fs.rename(src, path.resolve(dir, '../', `${task.finalName}.jar`))
}
