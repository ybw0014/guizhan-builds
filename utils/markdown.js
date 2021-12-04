import { marked } from 'marked'

const renderer = {
    link (href, title, text) {
        if (title === null) {
            return `<a href="${href}" target="_blank">${text}</a>`
        } else {
            return `<a href="${href}" title="${title}" target="_blank">${text}</a>`
        }
    }
}

marked.use({ renderer })

export default {
    render (source) {
        return marked.parse(source)
    }
}
