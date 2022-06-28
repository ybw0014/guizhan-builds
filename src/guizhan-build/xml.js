/**
 * 对 xml 库进行封装
 * @author ybw0014
 */

const convert = require('xml-js')

module.exports = {
    toJSON,
    toXML
}

/**
 * XML to JSON object
 * @param data xml string
 * @returns {Promise} resolve json
 */
function toJSON (data) {
    return Promise.resolve(convert.xml2js(data, {
        compact: true
    }))
}

/**
 * JSON object to XML
 * @param data js object
 * @returns {Promise<String>} resolve xml
 */
function toXML (data) {
    return Promise.resolve(convert.js2xml(data, {
        compact: true
    }))
}
