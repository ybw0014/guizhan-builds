<template>
    <fa-icon v-if="success" icon="check-circle" type="solid" class="text-green-500" />
    <fa-icon v-else icon="times-circle" type="solid" class="text-red-500" />
</template>

<script>
export default {
    name: 'BuildIcon',
    props: {
        success: {
            type: Boolean,
            default: true
        }
    }
}
</script>
