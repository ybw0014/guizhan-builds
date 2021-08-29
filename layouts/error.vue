<template>
    <div class="container mt-4">
        <b-card class="text-center mx-auto">
            <div class="error mx-auto d-inline-block" :data-text="code" v-text="code" />
            <div class="error-title mb-5" v-text="reason" />
            <div class="text-muted error-info" v-text="description" />
            <b-link class="error-info" to="/">
                返回首页
            </b-link>
        </b-card>
    </div>
</template>
<script>
export default {
    layout: 'main',
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
            this.reason = '页面不存在'
            this.description = '你正在访问的页面不存在'
        } else if (this.error.statusCode === 500) {
            this.code = 500
            this.reason = '内部错误'
            this.description = '发生了内部错误'
            console.error('发生内部错误: ', this.error.message)
        } else {
            this.code = NaN
            this.reason = '未知错误'
            this.description = '发生了未知错误'
            console.error(`发生位置错误(代码: ${this.error.statusCode}): `, this.error.message)
        }
    }
}
</script>
<style scoped>
.error {
    color: rgb(186, 188, 196);
    font-size: 7rem;
    position: relative;
    line-height: 1;
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

.error-title{
    font-size: 1.5rem;
    font-weight: bold;
}
.error-info{
    font-size: .8rem;
}
</style>
