<template>
    <img v-lazy-load :data-src="imgSource" alt="构建状态">
</template>
<script>
import axios from 'axios'
export default {
    props: {
        info: Object
    },
    data () {
        return {
            imgSource: ''
        }
    },
    computed: {
        source () {
            return '/f/' + this.info.user + '/' + this.info.repo + '/' + this.info.branch + '/badge.svg'
        }
    },
    mounted () {
        axios.get(this.source)
            .then((response) => {
                this.imgSource = this.source
            })
            .catch(() => {
                this.imgSource = '/images/default_badge.svg'
            })
    }
}
</script>
