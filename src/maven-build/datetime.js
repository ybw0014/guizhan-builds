/**
 * 有关时间日期的所有方法
 * @author ybw0014
 */

module.exports = {
    /**
     * ISO时间转为时间戳
     * @param isotime iso时间
     * @returns {number} 时间戳
     */
    isoToTimestamp(isotime) {
        return Date.parse(isotime)
    },
    /**
     * ISO时间转为标准时间格式
     * @param isotime iso时间
     * @returns {string} 标准时间格式
     */
    isoToString(isotime) {
        return Date.parse(isotime).toString()
    },
    /**
     * 时间戳转换为标准时间格式
     * @param timestamp 时间戳
     * @returns {string} 标准时间格式
     */
    timestampToString(timestamp) {
        return new Date(timestamp).toString()
    }
}
