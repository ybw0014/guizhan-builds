<template>
    <nav class="breadcrumb-wrapper">
        <ol class="breadcrumb">
            <slot>
                <breadcrumb-item
                    v-for="(item, index) in breadcrumbs"
                    :key="index"
                >
                    {{ item.text }}
                </breadcrumb-item>
            </slot>
        </ol>
    </nav>
</template>

<script>
export default {
    props: {
        breadcrumbs: {
            type: Array,
            default: () => []
        }
    },
    computed: {
    }
}
</script>

<style lang="scss" scoped>
.breadcrumb-wrapper{
    @apply w-full px-6 py-2;
}
.breadcrumb{
    @apply list-none flex;
}
</style>
