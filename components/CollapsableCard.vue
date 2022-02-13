<template>
    <card :title="title" class="collapsable">
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

<style scoped>
.collapsable {
    @apply overflow-y-auto;
}
</style>
