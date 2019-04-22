import Square from './Square.js';
import Bar from './Bar.js';
const SQUARE_NUM = 9;
const V_TARGETS = 88;

class VisualCanvas {
    constructor(canvas, isSquare) {
        const canvasStyle = window.getComputedStyle(canvas);
        const ratio = this.ratio = window.devicePixelRatio || 1;
        canvas.width = parseFloat(canvasStyle.width, 10) * ratio;
        canvas.height = parseFloat(canvasStyle.height, 10) * ratio;
        
        this.ctx = canvas.getContext("2d");
        this.ctx.fillStyle = "rgba(255,255,255,0.5)";      

        this.ctx.lineJoin = "round";
        this.ctx.lineWidth = 20;

        this.canvas = canvas;
        this.squares = [];

        this.draw = this.draw.bind(this);

        if(isSquare) {
            this.initSquares();
        } else {
            this.initBars();
        }
        
        this.draw();
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
            this.squares.push(new Bar(mX, mY, w, h));
        }
    }

    initSquares() {
        const count = SQUARE_NUM;
        const maxWidth = 40 * this.ratio;
        const {
            width,
            height
        } = this.canvas;
        const w = Math.min(Math.min(width, height) / (1.5 * count + 1.5), maxWidth);
        const startX = (width - (1.5 * count - 0.5) * w) / 2;
        const startY = (height - (1.5 * count - 0.5) * w) / 2;

        const centerX = 1.5 * w * Math.floor(count / 2) + startX;
        const centerY = 1.5 * w * Math.floor(count / 2) + startY;

        this.squares.push(new Square(centerX, centerY, w));

        for (let i = 1; i <= Math.floor(count / 2); i++) {
            let mX = centerX - 1.5 * w * i;
            let mY = centerY - 1.5 * w * i;

            // 往右 2 * i
            for (let j = 1; j <= 2 * i; j++) {
                mX += 1.5 * w;
                this.squares.push(new Square(mX, mY, w));
            }

            // 往下 2 * i
            for (let k = 1; k <= 2 * i; k++) {
                mY += 1.5 * w;
                this.squares.push(new Square(mX, mY, w));
            }

            // 往左 2 * i
            for (let m = 1; m <= 2 * i; m++) {
                mX -= 1.5 * w;
                this.squares.push(new Square(mX, mY, w));
            }

            // 往上 2 * i
            for (let n = 1; n <= 2 * i; n++) {
                mY -= 1.5 * w;
                this.squares.push(new Square(mX, mY, w));
            }
        }
    }

    update(array) {
        const {
            squares
        } = this;
        for (let i = 0; i < squares.length; i++) {
            if (array[i] !== undefined) {
                squares[i].update(array[i]);
            }
        }
        this.draw();
    }

    draw() {
        const {
            ctx,
            squares
        } = this;
        const len = squares.length;

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < len; i++) {
            squares[i].draw(ctx);
        }
    }
}

export default VisualCanvas;