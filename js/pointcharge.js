export class PointCharge {
    constructor(x, y, c) {
        this.x = x;
        this.y = y;

        this.setCharge(c);
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
        this.c = c != 0 ? c : 1;
        if (c < 0) this.color = '#FF0000';
        else this.color = '#0000FF';
    }
}