export default {
    title: 'Guizhan Builds',
    error: {
        back_home: 'Back to home page',
        404: {
            title: 'Page not found',
            message: 'We cannot find the page you are looking for'
        },
        500: {
            title: 'Internal error',
            message: 'An internal error has occurred'
        },
        unknown: {
            title: 'Unknown error',
            message: 'An unknown error has occurred'
        }
    },
    nav: {
        home: 'Home',
        back_home: 'Back to home page'
    },
    labels: {
        repo: 'Project',
        user: 'User',
        branch: 'Branch',
        status: 'Build status',
        repos: 'Repositories'
    },
    pages: {
        home: {
            announcement: 'Announcement',
            tabs: {
                repos: {
                    title: 'All repositories'
                },
                users: {
                    title: 'All users'
                }
            }
        },
        user: {
            back: 'Back to repositories list',
            github: 'Visit {user}\'s GitHub page',
            repos: '{user}\'s repositories'
        },
        repo: {
            back: 'Back to repositories list',
            github: 'Visit project\'s GitHub page',
            issues: 'Issue tracker',
            branches: '{repo}\'s branches'
        },
        branch: {
            back: 'Back to repositories list',
            github: 'Visit project\'s GitHub page',
            issues: 'Issue tracker',
            builds: 'All builds',
            build: 'Build #{build}',
            build_time: 'Built on {time}',
            log: 'Log',
            download_direct: 'Direct download',
            download_direct_tip: 'Powered by GitHub Pages + Cloudflare',
            download_drive: 'Web drive download',
            commit_info: '{author} committed on {time}',
            requirement: 'Requirement'
        }
    }
}
