<template>
    <div class="list-group">
        <slot />
    </div>
</template>

<script>
export default {
    name: 'ListGroup'
}
</script>

<style scoped>
.list-group{
    @apply flex flex-col;
}
</style>
