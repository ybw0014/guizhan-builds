/**
 * 对 xml 库进行封装
 * @author ybw0014
 */

const xmlParser = require('fast-xml-parser')

const parserOptions = {

}

// eslint-disable-next-line new-cap
let jsonParser = new xmlParser.j2xParser(parserOptions)

module.exports = {
    toJSON(data) {
        return new Promise((resolve, reject) => {
            if (!xmlParser.validate(data)) {
                reject(new Error('不是有效的XML文件'))
                return
            }
            resolve(xmlParser.parse(data, parserOptions))
        })
    },
    toXML(data) {
        return new Promise((resolve, reject) => {
            resolve(jsonParser.parse(data))
        })
    }
}
