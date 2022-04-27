// Low level canvas stuff
const canvas = document.getElementById("canvas");
const canvas_context = canvas.getContext("2d");
const canvas_buffer = canvas_context.getImageData(0, 0, canvas.clientWidth, canvas.height);
const canvas_pitch = canvas_buffer.width * 4;

const putPixel = (x, y, colour) => {
    x = canvas.width / 2 + x;
    y = canvas.height / 2 - y - 1;

    if (tx < 0 || tx >= canvas.width || ty < 0 || ty >= canvas.height) {
        return;
    }

    const offset = 4 * tx + canvas_pitch * ty;
    canvas_buffer.data[offset++] = colour[0];
    canvas_buffer.data[offset++] = colour[1];
    canvas_buffer.data[offset++] = colour[2];
    canvas_buffer.data[offset++] = 255;
}

const updateCanvas = () => {
    canvas_context.putImageData(canvas_buffer, 0, 0);
}

// Models
class Vect2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Vect3 extends Vect2 {
    constructor(x, y, z) {
        super(x, y);
        this.z = z;
    }
}


// Raytracing
const camPos = new Vect3(0, 0, 0);

for (let x = -canvas.width / 2; x <= canvas.width / 2; x++) {
    for (let y = -canvas.height / 2; y <= canvas.width / 2; y++) {

    }
}
