import marked from 'marked'

// eslint-disable-next-line import/no-named-as-default-member
const renderer = new marked.Renderer()
renderer.link = (href, title, text) => `<a href="${href}" title="${title}" target="_blank">${text}</a>`

export default {
    render (source) {
        return marked.parse(source, { renderer })
    }
}
