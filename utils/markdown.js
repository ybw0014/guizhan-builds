import marked from 'marked'

const renderer = new marked.Renderer()
renderer.link = (href, title, text) => `<a href="${href}" title="${title}" target="_blank">${text}</a>`

export default {
    render (source) {
        return marked(source, {
            renderer
        })
    }
}
