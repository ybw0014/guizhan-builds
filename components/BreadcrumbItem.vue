<template>
    <li class="breadcrumb-item" :class="classes">
        <nuxt-link v-if="isLink" :to="to" v-bind="$attrs">
            <slot />
        </nuxt-link>
        <slot v-else v-bind="$attrs" />
    </li>
</template>

<script>
import _ from 'lodash'

export default {
    name: 'BreadcrumbItem',
    props: {
        to: {
            type: [String, Object],
            default: () => {}
        }
    },
    computed: {
        classes () {
            return {
                active: _.has(this.$attrs, 'active')
            }
        },
        isLink () {
            return (_.isString(this.to) && this.to !== '') ||
                (_.isObject(this.to) && !_.isEmpty(this.to))
        }
    }
}
</script>

<style lang="scss" scoped>
.breadcrumb-item {
    @apply text-gray-900;

    &:not(:first-child) {
        @apply pl-2;
    }
    &.active{
        @apply text-gray-500;
    }
}
.breadcrumb-item:not(:first-child):before{
    content: "/";
    @apply pr-1;
}
</style>
