<template>
    <keep-alive>
        <div v-if="isActive" class="tab-panel">
            <slot />
        </div>
    </keep-alive>
</template>

<script>
import _ from 'lodash'

export default {
    props: {
        title: {
            type: String,
            default: 'Tab'
        }
    },
    data () {
        return {
            isActive: false
        }
    },
    created () {
        if (_.has(this.$attrs, 'active') && this.$attrs.active) {
            this.isActive = true
            delete this.$attrs.active
        }
    }
}
</script>
