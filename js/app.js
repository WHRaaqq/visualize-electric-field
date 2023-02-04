import { PointCharge } from './pointcharge.js';
import { ElectricFlux } from './electricflux.js';

class App {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');

        document.getElementById("add_point_charge").onclick = this.addPointCharge.bind(this);
        this.charge_input = document.getElementById("change_charge");
        this.charge_input.onchange = this.changeSelectedCharge.bind(this);

        this.clickable_objs = [];

        this.draging_obj = null;
        this.selected_obj = null;

        this.N_OF_LINES_PER_POINT = 15;

        if (this.canvas) {
            this.canvas.addEventListener("mousedown", this.startDraging.bind(this));
            this.canvas.addEventListener("mouseup", this.stopDraging.bind(this));
            this.canvas.addEventListener("mouseleave", this.stopDraging.bind(this));
            this.canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
        }
    }

    draw() {
        this.ctx.fillStyle = '#BBBBBB';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.clickable_objs.forEach(o => {
            for (let i = 0; i < this.N_OF_LINES_PER_POINT; i++) {
                const angle = 2 * Math.PI / this.N_OF_LINES_PER_POINT;
                const x = o.x + 10 * Math.cos(i * angle);
                const y = o.y + 10 * Math.sin(i * angle);
                let ef = new ElectricFlux(x, y, o.c);
                ef.draw(this.ctx, this.clickable_objs);
            }
        });

        this.clickable_objs.forEach(o => {
            o.draw(this.ctx);
        });
    }

    addPointCharge() {
        const x = Math.random() * this.canvas.width;
        const y = Math.random() * this.canvas.height;
        const c = Math.floor(Math.random() * 20 - 10);

        this.clickable_objs.push(new PointCharge(x, y, c));
        this.draw();
    }

    changeSelectedCharge() {
        if (this.selected_obj == null) return;
        this.selected_obj.c = this.charge_input.value;

        this.draw();
    }

    startDraging(e) {
        const ex = e.x;
        const ey = e.y;
        this.clickable_objs.forEach(o => {
            if (o.collidePoint(ex, ey)) {
                this.draging_obj = o;
            }
        });

        if (this.draging_obj == null) return;

        this.selected_obj = this.draging_obj;
        this.charge_input.value = this.selected_obj.c;

        const dx = this.draging_obj.x - ex;
        const dy = this.draging_obj.y - ey;
        this.offset = { x: dx, y: dy };
    }

    stopDraging(e) {
        this.draging_obj = null;
        this.draw();
    }

    onMouseMove(e) {
        if (this.draging_obj == null) return;

        const x = e.x + this.offset.x;
        const y = e.y + this.offset.y;
        this.draging_obj.moveTo(x, y);

        this.draw();
    }
}

window.onload = () => {
    new App();
};
