<template>
    <nuxt-link v-if="isNuxtLink" :to="to" class="list-group-item" :class="itemClass">
        <slot />
    </nuxt-link>
    <a v-else :href="href" class="list-group-item" :class="itemClass">
        <slot />
    </a>
</template>

<script>
import _ from 'lodash'

export default {
    name: 'ListGroupItem',
    props: {
        to: {
            type: [String, Object],
            default: () => {}
        },
        href: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            itemClass: ''
        }
    },
    computed: {
        isNuxtLink () {
            return (_.isString(this.to) && this.to !== '') ||
                (_.isObject(this.to) && !_.isEmpty(this.to))
        }
    },
    created () {
        this.itemClass = this.$parent.itemClass
    }
}
</script>

<style lang="scss" scoped>
.list-group-item{
    @apply px-2 py-3 text-gray-900 bg-white;
    @apply dark:bg-gray-800 dark:text-gray-200;
    @apply transition-colors;

    &:not(:last-child){
        @apply border-b border-gray-200;
        @apply dark:border-gray-700;
    }

    &:hover{
        @apply bg-gray-50;
        @apply dark:bg-gray-700;
    }

    &::v-deep{
        .fa-icon{
            @apply mr-2;
        }
    }
}
</style>
