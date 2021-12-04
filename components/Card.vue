<template>
    <div class="card">
        <div class="card-header">
            <h2 v-if="hasTitle" class="card-title">
                <slot name="title">
                    {{ title }}
                </slot>
            </h2>
        </div>
        <div class="card-body">
            <slot />
        </div>
    </div>
</template>

<script>
export default {
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

<style lang="scss" scoped>
.card{
    @apply mx-2 sm:mx-0 p-5 shadow-lg rounded-2xl bg-white text-black;
    @apply dark:bg-gray-800 dark:text-gray-200;

    .card-title{
        @apply text-xl font-bold mb-4;
    }
}
</style>
