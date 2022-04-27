<template>
    <div class="page-header">
        <a href="/" :title="$t('nav.back_home')" class="text-inherit">
            {{ $t('title') }}
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
    @apply flex justify-between items-center text-lg font-bold mx-auto p-4;
    @apply bg-white text-gray-700 border-b border-gray-200;
    @apply sm:text-xl sm:mx-0;
    @apply dark:bg-gray-900 dark:border-gray-900 dark:text-gray-300;
}
</style>
