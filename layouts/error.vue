<template>
    <div class="container mt-4 mx-auto">
        <div class="card text-center flex flex-auto flex-col">
            <div class="error mx-auto inline-block" :data-text="code" v-text="code" />
            <div class="mb-12 text-2xl font-bold" v-text="reason" />
            <div class="error-info text-gray-500" v-text="description" />
            <NuxtLink class="error-info mt-2 text-blue-500" to="/">
                {{ $t('nav.home') }}
            </NuxtLink>
        </div>
    </div>
</template>
<script>
export default {
    layout: 'main',
    // eslint-disable-next-line vue/require-prop-types
    props: ['error'],
    data () {
        return {
            code: NaN,
            reason: '',
            description: ''
        }
    },
    mounted () {
        if (this.error.statusCode === 404) {
            this.code = 404
            this.reason = this.$t('error.404.title')
            this.description = this.$t('error.404.message')
        } else if (this.error.statusCode === 500) {
            this.code = 500
            this.reason = this.$t('error.500.title')
            this.description = this.$t('error.500.message')
            // eslint-disable-next-line no-console
            console.error('Internal error: ', this.error.message)
        } else {
            this.code = NaN
            this.reason = this.$t('error.unknown.title')
            this.description = this.$t('error.unknown.title')
            // eslint-disable-next-line no-console
            console.error(`Unknown error (code: ${this.error.statusCode}): `, this.error.message)
        }
    }
}
</script>
<style scoped>
.error {
    color: rgb(186, 188, 196);
    @apply text-9xl relative;
}
@keyframes noise-anim {
    0% {
        clip: rect(49px,9999px,40px,0)
    }

    5% {
        clip: rect(75px,9999px,72px,0)
    }

    10% {
        clip: rect(97px,9999px,93px,0)
    }

    15% {
        clip: rect(15px,9999px,9px,0)
    }

    20% {
        clip: rect(14px,9999px,92px,0)
    }

    25% {
        clip: rect(18px,9999px,94px,0)
    }

    30% {
        clip: rect(17px,9999px,20px,0)
    }

    35% {
        clip: rect(71px,9999px,59px,0)
    }

    40% {
        clip: rect(42px,9999px,84px,0)
    }

    45% {
        clip: rect(56px,9999px,25px,0)
    }

    50% {
        clip: rect(46px,9999px,14px,0)
    }

    55% {
        clip: rect(47px,9999px,1px,0)
    }

    60% {
        clip: rect(64px,9999px,58px,0)
    }

    65% {
        clip: rect(89px,9999px,92px,0)
    }

    70% {
        clip: rect(56px,9999px,39px,0)
    }

    75% {
        clip: rect(80px,9999px,71px,0)
    }

    80% {
        clip: rect(8px,9999px,13px,0)
    }

    85% {
        clip: rect(66px,9999px,68px,0)
    }

    90% {
        clip: rect(68px,9999px,4px,0)
    }

    95% {
        clip: rect(56px,9999px,14px,0)
    }

    100% {
        clip: rect(28px,9999px,53px,0)
    }
}
@keyframes noise-anim-2 {
    0% {
        clip: rect(16px,9999px,10px,0)
    }

    5% {
        clip: rect(22px,9999px,29px,0)
    }

    10% {
        clip: rect(6px,9999px,68px,0)
    }

    15% {
        clip: rect(85px,9999px,95px,0)
    }

    20% {
        clip: rect(65px,9999px,91px,0)
    }

    25% {
        clip: rect(93px,9999px,68px,0)
    }

    30% {
        clip: rect(10px,9999px,27px,0)
    }

    35% {
        clip: rect(37px,9999px,25px,0)
    }

    40% {
        clip: rect(12px,9999px,23px,0)
    }

    45% {
        clip: rect(40px,9999px,18px,0)
    }

    50% {
        clip: rect(19px,9999px,71px,0)
    }

    55% {
        clip: rect(2px,9999px,35px,0)
    }

    60% {
        clip: rect(16px,9999px,69px,0)
    }

    65% {
        clip: rect(8px,9999px,65px,0)
    }

    70% {
        clip: rect(30px,9999px,57px,0)
    }

    75% {
        clip: rect(14px,9999px,4px,0)
    }

    80% {
        clip: rect(39px,9999px,30px,0)
    }

    85% {
        clip: rect(22px,9999px,35px,0)
    }

    90% {
        clip: rect(58px,9999px,71px,0)
    }

    95% {
        clip: rect(34px,9999px,90px,0)
    }

    100% {
        clip: rect(67px,9999px,68px,0)
    }
}
.error::before {
    content: attr(data-text);
    position: absolute;
    left: -2px;
    text-shadow: rgb(88, 119, 213) 1px 0px;
    top: 0px;
    color: rgb(186, 188, 196);
    clip: rect(0px, 900px, 0px, 0px);
    background: transparent;
    overflow: hidden;
    animation: 3s linear 0s infinite alternate-reverse none running noise-anim-2;
}
.error::after {
    content: attr(data-text);
    position: absolute;
    left: 2px;
    text-shadow: rgb(211, 91, 80) -1px 0px;
    top: 0px;
    color: rgb(186, 188, 196);
    clip: rect(0px, 900px, 0px, 0px);
    background: transparent;
    overflow: hidden;
    animation: 2s linear 0s infinite alternate-reverse none running noise-anim;
}
.error-info{
    @apply text-sm;
}
</style>
