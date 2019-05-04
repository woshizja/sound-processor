class Bar {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.bottom = h + y;
        this.opacity = 0.3;
        //缓动系数，数值越大动画越"缓"
        this.smoother = 0;
    }

    update(amplitude) {
        const {
            smoother,
            last
        } = this;
        const lastAmp = last !== undefined ? last : amplitude;
        const lastOpa = 0.05 + 0.95 * lastAmp / 255;
        const nextOpa = 0.05 + 0.95 * amplitude / 255;
        this.opacity = smoother * lastOpa + (1 - smoother) * nextOpa;
        this.last = amplitude;
    }

    draw(ctx) {
        const {
            opacity,
            x,
            w,
            h,
            bottom
        } = this;
        const newY = bottom - h * opacity;
        ctx.fillStyle = `hsla(4, ${80*opacity}%, 51%, ${opacity})`;

        ctx.beginPath();
        ctx.rect(x, newY, w, h * opacity);
        ctx.closePath();
        ctx.fill();
    }
}

export default Bar;