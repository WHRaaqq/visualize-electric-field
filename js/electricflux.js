export class ElectricFlux {
    constructor(x, y, c) {
        this.x = x;
        this.y = y;

        this.c = c < 0 ? 1 : -1;

        this.ds = 10;
    }

    draw(ctx, charges) {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        while (true) {
            const force = this.getElectricForce(charges);
            const dir = this.normalize(force);

            this.x += this.ds * dir.x;
            this.y += this.ds * dir.y;

            ctx.lineTo(this.x, this.y);

            const outofboard = this.x < 0 || this.x > 800 || this.y < 0 || this.y > 800;
            if (outofboard) break;

            let hit_charge = false;
            charges.forEach(c => {
                if (c.collidePoint(this.x, this.y)) hit_charge = true;
            });
            if (hit_charge) break;
        }
        ctx.stroke();
    }

    getElectricForce(charges) {
        let Fx = 0;
        let Fy = 0;

        charges.forEach(charge => {
            const rx = charge.x - this.x;
            const ry = charge.y - this.y;
            const r2 = rx * rx + ry * ry;
            const r = Math.sqrt(r2);
            const F = this.c * charge.c / r2 / r;
            Fx += F * rx;
            Fy += F * ry;
        });

        return { x: Fx, y: Fy };
    }

    normalize(v) {
        const size = Math.sqrt(v.x * v.x + v.y * v.y);
        return { x: v.x / size, y: v.y / size };
    }
}