import { PointCharge } from './pointcharge.js';
import { ElectricFlux } from './electricflux.js';

class App {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.selected_div = document.getElementById('charge_control_div');

        document.getElementById("add_point_charge").onclick = this.addPointCharge.bind(this);
        this.charge_input = document.getElementById("change_charge");
        this.charge_input.onchange = this.changeSelectedCharge.bind(this);
        document.getElementById("delete_charge").onclick = this.deleteSelectedCharge.bind(this);

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

        this.draw();
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
        console.log("changeSelectedCharge");
        if (this.selected_obj == null) return;
        this.selected_obj.setCharge(this.charge_input.value);

        this.draw();
    }

    deleteSelectedCharge() {
        if (this.selected_obj == null) return;

        const selected_index = this.clickable_objs.findIndex((obj) => obj === this.selected_obj);
        if (selected_index > -1) {
            this.clickable_objs.splice(selected_index, 1);
        }
        this.selected_obj = null;
        this.selected_div.style.visibility = 'hidden';

        this.draw();
    }

    getMousePos(e) {
        var rect = this.canvas.getBoundingClientRect();
        return [e.clientX - rect.left, e.clientY - rect.top];
    }

    startDraging(e) {
        console.log('asdfasdf');
        const [ex, ey] = this.getMousePos(e);
        this.clickable_objs.forEach(o => {
            if (o.collidePoint(ex, ey)) {
                this.draging_obj = o;
            }
        });

        if (this.draging_obj == null) return;

        this.selected_obj = this.draging_obj;
        this.charge_input.value = this.selected_obj.c;
        this.selected_div.style.visibility = 'visible';

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

        const [ex, ey] = this.getMousePos(e);
        const x = ex + this.offset.x;
        const y = ey + this.offset.y;
        this.draging_obj.moveTo(x, y);

        this.draw();
    }
}

window.onload = () => {
    new App();
};
