<template>
    <img v-lazy="source" alt="构建状态" />
</template>
<script>
export default {
    props: {
        info: Object
    },
    computed: {
        source () {
            return '/f/' + this.info.user + '/' + this.info.repo + '/' + this.info.branch + '/badge.svg'
        }
    },
    methods: {
        handleError (e) {
            console.log('err', e.target)
        }
    }
}
</script>
