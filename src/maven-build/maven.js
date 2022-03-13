/**
 * 有关 Maven 的所有方法
 * @author ybw0014
 */

const fileSystem = require('fs')
const fs = fileSystem.promises
const path = require('path')
const maven = require('maven')

const config = require('./config')
const logger = require('./logger')
const projects = require('./projects')
const xml = require('./xml')

module.exports = {
    /**
     * 设置输出版本
     * @param task 任务
     * @returns {Promise} 设置成功则resolve
     */
    setVersion (task) {
        return new Promise((resolve, reject) => {
            const pomFile = path.resolve(__dirname, '../../', config.projects_dir, task.directory, config.project_workspace_dir, './pom.xml')

            fs.readFile(pomFile, 'utf-8').then((data) => { // read pom.xml
                xml.toJSON(data).then((json) => { // xml to json
                    // version
                    let date = new Date(task.commit.timestamp)

                    let version = task.options.target.version
                        .replace('{version}', task.version)
                        .replace('{git_commit}', task.commit.hash.substr(0, 7))
                        .replace('{year}', date.getFullYear())
                        .replace('{month}', date.getMonth())
                        .replace('{day}', date.getDay())

                    json.project.version = version

                    // target name
                    if (!json.project.build) {
                        json.project.build = {}
                    }

                    /* eslint-disable no-template-curly-in-string */
                    json.project.name = task.options.target.name
                    json.project.build.finalName = '${project.name}-${project.version}'

                    task.finalName = json.project.build.finalName
                        .replace('${project.name}', json.project.name)
                        .replace('${project.version}', version)
                    /* eslint-disable no-template-curly-in-string */

                    // write pom.xml
                    xml.toXML(json).then((xmlData) => {
                        fs.writeFile(pomFile, xmlData, 'utf8').then(resolve, reject)
                    }, reject)
                }, reject)
            }, reject)
        })
    },

    /**
     * 构建任务项目
     * @param task 任务
     * @returns {Promise} promise
     */
    build (task) {
        return new Promise((resolve, reject) => {
            logger.log('> 构建项目: ' + task.directory)

            let dir = projects.getWorkingDirectory(task)
            let logFile = path.resolve(dir, `../${task.repo}-${task.branch}-${task.version}.log`)

            const mvn = maven.create({
                cwd: dir,
                batchMode: true,
                logFile
            })
            mvn.execute(['clean', 'package']).then(resolve, reject)
        })
    },

    /**
     * 将构建目标文件移动
     * @param task 任务
     * @returns {Promise} 总是resolve
     */
    relocateTarget (task) {
        if (!task.success) {
            return Promise.resolve()
        }

        let dir = projects.getWorkingDirectory(task)

        return fs.rename(
            path.resolve(dir, './target/', `${task.finalName}.jar`),
            path.resolve(dir, '../', `${task.finalName}.jar`)
        )
    }
}
