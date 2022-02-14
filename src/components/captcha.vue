<template>
  <canvas
    ref="canvas"
    :height="height"
    :width="width"
    @click="refreshCaptcha" />
</template>

<script>
import { originalCharacter, randomColor, randomNum } from '@/utils/captcha';

export default {
    name: 'VueCaptcha',
    props: {
        captcha: {
            type: [String, Number],
            default: '',
        },
        height: {
            type: Number,
            default: 40,
        },
        width: {
            type: Number,
            default: 100,
        },
        bgColor: {
            type: String,
            default: '#DFF0D8',
        },
        charNum: {
            type: Number,
            default: 4,
        },
        fontSize: {
            type: Number,
            default: 25,
        },
        onChange: {
            type: Function,
            default: null,
        },
    },
    components: {},
    data() {
        return {};
    },
    computed: {},
    methods: {
        generateCaptcha(defaultCharacter) {
            let checkCode = '';
            if (this.$refs.canvas) {
                const ctx = this.$refs.canvas.getContext('2d');
                if (ctx) {
                    ctx.clearRect(0, 0, this.width, this.height);
                    ctx.beginPath();
                    ctx.fillStyle = this.bgColor;
                    ctx.fillRect(0, 0, this.width, this.height);
                    // eslint-disable-next-line no-plusplus
                    for (let i = 0; i < this.charNum; i++) {
                        const charGap = Math.round(this.width / this.charNum);
                        const offset = Math.round(charGap / 2) - 6;
                        let code = originalCharacter[randomNum(0, originalCharacter.length - 1)];
                        if (defaultCharacter && defaultCharacter.length) {
                            code = defaultCharacter[i] || '';
                        }
                        checkCode += code;
                        ctx.save();
                        ctx.beginPath();
                        ctx.fillStyle = 'white';
                        ctx.strokeStyle = randomColor();
                        ctx.font = `${this.fontSize}px serif`;
                        ctx.rotate((Math.PI / 180) * randomNum(-5, 5));
                        ctx.strokeText(code, offset + i * charGap, this.height / 2 + 8);
                        ctx.beginPath();
                        ctx.moveTo(randomNum(0, this.width), randomNum(0, this.height));
                        ctx.lineTo(randomNum(0, this.width), randomNum(0, this.height));
                        ctx.stroke();
                        ctx.restore();
                    }
                    return checkCode;
                }
                return '';
            }
            return '';
        },
        refreshCaptcha(captcha) {
            const code = this.generateCaptcha(captcha);
            this.$emit('on-change', code);
            this.$emit('update:captcha', code);
        },
    },
    mounted() {
        this.refreshCaptcha(this.captcha);
    },
};
</script>
<style scoped></style>
