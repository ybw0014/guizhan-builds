<template>
    <div class="page-header">
        <a href="/" title="返回首页" class="text-inherit">
            {{ $consts.title }}
        </a>
    </div>
</template>

<script>
export default {
    name: 'PageHeader'
}
</script>

<style lang="scss" scoped>
.page-header {
    @apply flex justify-between items-center bg-white border-b p-4 text-gray-700 text-lg font-bold mx-auto;
    @apply sm:text-xl sm:mx-0;
    @apply dark:bg-gray-900 dark:border-gray-900 dark:text-gray-300;
}
</style>
