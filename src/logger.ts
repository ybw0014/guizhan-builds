/**
 * 有关 日志 的所有方法
 * @author ybw0014
 */
/* eslint "no-console": "off" */
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument */

/**
 * 封装调试输出
 */
function debugLog(...messages: any[]) {
    if (process.env.DEBUG === '1') {
        console.log('[DEBUG] ', ...messages)
    }
}

/**
 * 封装日志输出
 */
function log(...messages: any[]) {
    console.log(...messages)
}

/**
 * 封装错误输出
 * @param messages
 */
function error(...messages: any[]) {
    console.error(...messages)
}

/**
 * axios 错误输出
 */
// export function axiosError(error: AxiosResponse) {
//     if (error.data) {
//         console.error('axios错误: ', error.data.message)
//     } else if (error.response) {
//         console.error('axios错误: ', error.response.statusText)
//     } else {
//         console.error('axios错误: 无响应')
//     }
// }

export default {
    debugLog,
    log,
    error
}
