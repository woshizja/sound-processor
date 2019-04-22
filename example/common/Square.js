class Square {
    constructor(x, y, w) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.opacity = 0.3;
        //缓动系数，数值越大动画越"缓"
        this.smoother = 0.3;
    }

    update(f) {
        const {
            smoother,
            lastF
        } = this;
        const lf = lastF !== undefined ? lastF : f;
        const lo = 0.3 + 0.7 * lf / 255;
        const fo = 0.3 + 0.7 * f / 255;
        this.opacity = smoother * lo + (1 - smoother) * fo;
        this.lastF = f;
    }

    draw(ctx) {
        const {
            opacity,
            x,
            y,
            w
        } = this;
        ctx.fillStyle = `rgba(${212 * opacity}, 60, 51, ${opacity})`;
        ctx.beginPath();
        ctx.rect(x, y, w, w);
        ctx.closePath();
        ctx.fill();
    }
}

export default Square;