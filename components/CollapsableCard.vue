<template>
    <card :title="title">
        <template v-if="!!$slots.title" #title>
            <slot name="title" />
        </template>
        <slot />
    </card>
</template>

<script>
export default {
    name: 'CollapsableCard',
    props: {
        title: {
            type: String,
            default: ''
        }
    },
    computed: {
        hasTitle () {
            return (this.title !== '') || (!!this.$slots.title)
        }
    }
}
</script>
