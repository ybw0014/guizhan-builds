<template>
    <img v-lazy-load :data-src="imgSource" alt="构建状态" @load="imageLoaded">
</template>
<script>
export default {
    name: 'BuildStatus',
    props: {
        user: {
            type: String,
            default: ''
        },
        repo: {
            type: String,
            default: ''
        },
        branch: {
            type: String,
            default: 'master'
        }
    },
    data () {
        return {
            imgSource: ''
        }
    },
    computed: {
        source () {
            return '/f/' + this.user + '/' + this.repo + '/' + this.branch + '/badge.svg'
        }
    },
    mounted () {
        this.imgSource = this.source
    },
    methods: {
        imageLoaded () {
            if (!this.$el.classList.contains('isLoading')) {
                return
            }
            if (this.$el.classList.contains('isLoaded')) {
                return
            }

            if (this.$el.width <= 1) {
                this.imgSource = '/images/default_badge.svg'
            }
        }
    }
}
</script>
