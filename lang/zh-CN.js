export default {
    title: '鬼斩的构建站',
    error: {
        back_home: '返回首页',
        404: {
            title: '页面不存在',
            message: '我们无法找到你正在访问的页面'
        },
        500: {
            title: '内部错误',
            message: '发生了内部错误'
        },
        unknown: {
            title: '未知错误',
            message: '发生了未知错误'
        }
    },
    nav: {
        home: '首页',
        back_home: '返回首页'
    },
    labels: {
        repo: '项目名称',
        user: '用户',
        branch: '分支',
        status: '构建状态',
        repos: '仓库'
    },
    pages: {
        home: {
            announcement: '公告',
            tabs: {
                repos: {
                    title: '所有仓库'
                },
                users: {
                    title: '所有用户'
                }
            }
        },
        user: {
            back: '返回仓库列表',
            github: '访问 {user} 的 GitHub 主页',
            repos: '{user} 的所有仓库'
        },
        repo: {
            back: '返回仓库列表',
            github: '项目 GitHub 主页',
            issues: '问题追踪器',
            branches: '{repo} 的所有分支'
        },
        branch: {
            back: '返回仓库列表',
            github: '项目 GitHub 主页',
            issues: '问题追踪器',
            builds: '所有构建',
            build: '构建 #{build}',
            build_time: '构建于 {time}',
            log: '日志',
            download_direct: '直接下载',
            download_direct_tip: '由 GitHub Pages + Cloudflare 提供下载',
            download_drive: '网盘下载',
            commit_info: '{author} 于 {time} 提交',
            requirement: '运行需求'
        }
    }
}
