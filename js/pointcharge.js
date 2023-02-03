export class PointCharge {
    constructor(x, y, c) {
        this.x = x;
        this.y = y;
        this.c = c;

        this.color = '#FF0000';
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    collidePoint(x, y) {
        const dx = this.x - x;
        const dy = this.y - y;
        const d2 = dx * dx + dy * dy;

        return d2 < 100;
    }

    moveTo(x, y) {
        this.x = x;
        this.y = y;
    }

    setCharge(c) {
        this.c = c;
    }
}