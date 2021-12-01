<template>
    <grid :cols="cols" :rows="data" />
</template>
<script>
import Grid from 'gridjs-vue'

export default {
    components: {
        Grid
    },
    props: {
        cols: Array,
        data: Array
    }
}
</script>
