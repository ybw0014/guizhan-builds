<template>
    <div class="list-group">
        <slot />
    </div>
</template>

<script>
export default {
    name: 'ListGroup',
    props: {
        itemClass: {
            type: [String, Object],
            default: ''
        }
    }
}
</script>

<style scoped>
.list-group{
    @apply flex flex-col;
}
</style>
