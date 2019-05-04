import Square from './Square.js';
import Bar from './Bar.js';
const SQUARE_NUM = 9;
const V_TARGETS = 81;

class VisualCanvas {
    constructor(canvas, type) {
        const canvasStyle = window.getComputedStyle(canvas);
        const ratio = this.ratio = window.devicePixelRatio || 1;
        canvas.width = parseFloat(canvasStyle.width, 10) * ratio;
        canvas.height = parseFloat(canvasStyle.height, 10) * ratio;
        
        this.ctx = canvas.getContext("2d");
        this.ctx.fillStyle = "rgba(255,255,255,0.5)";      

        this.ctx.lineJoin = "round";
        this.ctx.lineWidth = 20;

        this.canvas = canvas;
        this.targets = [];

        this.draw = this.draw.bind(this);

        if(!type) {
            this.initBars();
        } else if(type === 1) {
            this.initSquares();
        } else if(typeof type === 'object') {
            this.target = type;
        }
    }

    initBars() {
        const count = V_TARGETS;
        const gap = 5;
        const {
            width,
            height
        } = this.canvas;

        const w = (width - gap * count - gap) / count;
        const h = 300;
        const mY = height - h;

        for (let i = 0; i < count; i++) {
            let mX = w * i + (i + 1) * gap;
            this.targets.push(new Bar(mX, mY, w, h));
        }
        this.draw();
    }

    initSquares() {
        const count = SQUARE_NUM;
        const maxWidth = 40 * this.ratio;
        const radius = Math.floor(count / 2);
        const {
            width,
            height
        } = this.canvas;
        const w = Math.min(Math.min(width, height) / (1.5 * count + 1.5), maxWidth);
        const startX = (width - (1.5 * count - 0.5) * w) / 2;
        const startY = (height - (1.5 * count - 0.5) * w) / 2;

        const centerX = 1.5 * w * radius + startX;
        const centerY = 1.5 * w * radius + startY;

        // 乌拉姆螺旋，质数螺旋
        for (let i = 0; i < radius; i++) {
            let mX = centerX + 1.5 * w * i;
            let mY = centerY + 1.5 * w * i;
            this.targets.push(new Square(mX, mY, w));
            
            // 往右一步
            mX += 1.5 * w;
            this.targets.push(new Square(mX, mY, w));

            // 往上 i * 2 + 1
            for(let j = 1; j <= i * 2 + 1; j++) {
                mY -= 1.5 *w;
                this.targets.push(new Square(mX, mY, w));
            }

            // 往左 i * 2
            for(let k = 1; k <= i * 2 + 2; k++) {
                mX -= 1.5 *w;
                this.targets.push(new Square(mX, mY, w));
            }

            // 往下 i * 2
            for(let m = 1; m <= i * 2 + 2; m++) {
                mY += 1.5 *w;
                this.targets.push(new Square(mX, mY, w));
            }

            // 往右 i * 2 + 1
            for(let n = 1; n <= i * 2 + 1; n++) {
                mX += 1.5 *w;
                this.targets.push(new Square(mX, mY, w));
            }

            // 最后一格
            if(i === radius - 1) {
                mX += 1.5 *w;
                this.targets.push(new Square(mX, mY, w));
            }
        }
        this.draw();
    }

    update(array) {
        const {
            targets,
            target
        } = this;

        if(target) {
            const scale = 0.9 + array[0] / 255;
            target.style.transform = `scale(${scale})`;
            target.style.opacity = `${0.3 + array[0] / 255}`;
        } else {
            for (let i = 0; i < targets.length; i++) {
                if (array[i] !== undefined) {
                    targets[i].update(array[i]);
                }
            }
            this.draw();
        }
    }

    draw() {
        const {
            ctx,
            targets
        } = this;
        const len = targets.length;

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < len; i++) {
            targets[i].draw(ctx);
        }
    }
}

export default VisualCanvas;