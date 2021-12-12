/**
 * 有关 日志 的所有方法
 * @author ybw0014
 */

/* eslint "no-console": "off" */

module.exports = {
    /**
     * 封装调试输出
     * @param messages
     */
    debug (...messages) {
        if (process.env.DEBUG === 1) {
            console.log(messages)
        }
    },

    /**
     * 封装日志输出
     * @param messages
     */
    log (...messages) {
        console.log(messages)
    },

    /**
     * 封装错误输出
     * @param messages
     */
    error (...messages) {
        console.error(messages)
    }
}
