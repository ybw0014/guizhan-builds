/**
 * 有关 Maven 的所有方法
 * @author ybw0014
 */

const fileSystem = require('fs')
const fs = fileSystem.promises
const path = require('path')
const fse = require('fs-extra')
const maven = require('maven')

const logger = require('./logger')
const projects = require('./projects')
const xml = require('./xml')

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
        const pomFile = path.resolve(projects.getWorkingDirectory(task), './pom.xml')

        fs.readFile(pomFile, 'utf-8').then((data) => { // read pom.xml
            xml.toJSON(data).then((json) => { // xml to json
                // version
                json.project.version = task.finalVersion

                // target name
                if (!json.project.build) {
                    json.project.build = {}
                }

                /* eslint-disable no-template-curly-in-string */
                json.project.name = task.options.target.name
                json.project.build.finalName = '${project.name}-${project.version}'

                task.finalName = json.project.build.finalName
                    .replace('${project.name}', json.project.name)
                    .replace('${project.version}', task.finalVersion)
                /* eslint-disable no-template-curly-in-string */

                // write pom.xml
                xml.toXML(json).then((xmlData) => {
                    fs.writeFile(pomFile, xmlData, 'utf8').then(resolve, reject)
                }, reject)
            }, reject)
        }, reject)
    })
}

/**
 * 构建任务项目
 * @param task 任务
 * @returns {Promise} promise
 */
function build (task) {
    return new Promise((resolve, reject) => {
        logger.log('> 构建项目: ' + task.directory)

        let dir = projects.getWorkingDirectory(task)
        let logBranch = task.branch.replace('/', '-')
        let logFilename = path.resolve(dir, `../${task.repo}-${logBranch}-${task.version}.log`)

        let mvnDir = path.join(dir, './.mvn')
        // 如有.mvn目录则移除
        if (fileSystem.existsSync(mvnDir)) {
            fse.emptyDirSync(mvnDir)
        }

        const mvn = maven.create({
            cwd: dir,
            batchMode: true,
            logFilename
        })
        mvn.execute(['clean', 'package']).then(resolve, reject)
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
    let src = path.resolve(dir, './target/', `${task.finalName}.jar`)

    return fs.rename(src, path.resolve(dir, '../', `${task.finalName}.jar`))
}
