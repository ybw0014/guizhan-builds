<template>
    <div class="tabs">
        <ul class="tab-header">
            <li
                v-for="(tab, index) in tabs"
                :key="tab.title"
                class="tab-title"
                :class="{ 'tab-title--active': activeTabIndex === index }"
                @click="clickTab(index)"
            >
                {{ tab.title }}
            </li>
        </ul>
        <slot />
    </div>
</template>

<script>
import _ from 'lodash'

export default {
    name: 'Tabs',
    data () {
        return {
            tabs: [],
            activeTabIndex: 0
        }
    },
    created () {
        this.tabs = this.$children
    },
    mounted () {
        let hasActive = false
        // 检测是否有 active
        _.forEach(this.tabs, (tab, index) => {
            if (tab.isActive) {
                this.selectTab(index)
                hasActive = true
                return false
            }
        })
        if (!hasActive) {
            this.selectTab(0)
        }
    },
    methods: {
        selectTab (i) {
            let isNewTab = this.activeTabIndex !== i

            this.activeTabIndex = i

            this.tabs.forEach((tab, index) => {
                tab.isActive = (index === i)
            })

            return isNewTab
        },
        clickTab (i) {
            if (this.selectTab(i)) {
                this.$emit('tabSelect', this.tabs[i])
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.tab-header {
    @apply flex items-center mb-4;
}
.tab-title {
    @apply cursor-pointer py-2 px-4 text-gray-500 border-b-4 border-gray-200;
    @apply hover:text-gray-400;
    @apply dark:border-gray-600;

    &.tab-title--active {
        @apply border-b-blue-500 text-blue-500;
    }
}
</style>
