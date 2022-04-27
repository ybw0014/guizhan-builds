<template>
    <img v-lazy-load :data-src="imgSource" alt="Build status" @load="imageLoaded">
</template>
<script>
export default {
    name: 'BuildStatus',
    props: {
        dir: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            imgSource: ''
        }
    },
    computed: {
        source () {
            return '/f/' + this.dir + '/badge.svg'
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
