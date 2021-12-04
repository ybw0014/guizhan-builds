<template>
    <span :class="iconClass" />
</template>
<script>
import _ from 'lodash'
export default {
    props: {
        type: {
            type: String,
            default: 'regular'
        },
        icon: {
            type: String,
            default: ''
        }
    },
    computed: {
        iconClass () {
            let classes = ['fa-' + this.icon]
            switch (this.type) {
            case 'solid':
                classes.push('fas')
                break
            case 'regular':
                classes.push('far')
                break
            case 'light':
                classes.push('fal')
                break
            case 'duotone':
                classes.push('fad')
                break
            default:
                break
            }
            return _.join(classes, ' ')
        }
    }
}
</script>
