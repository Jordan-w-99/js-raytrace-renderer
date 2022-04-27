// Low level canvas stuff
const canvas = document.getElementById("canvas");
const canvas_context = canvas.getContext("2d");
const canvas_buffer = canvas_context.getImageData(0, 0, canvas.clientWidth, canvas.height);
const canvas_pitch = canvas_buffer.width * 4;

const putPixel = (x, y, colour) => {
    x = canvas.width / 2 + x;
    y = canvas.height / 2 - y - 1;

    if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) {
        return;
    }

    let offset = 4 * x + canvas_pitch * y;
    canvas_buffer.data[offset++] = colour.r;
    canvas_buffer.data[offset++] = colour.g;
    canvas_buffer.data[offset++] = colour.b;
    canvas_buffer.data[offset++] = 255;
}

const updateCanvas = () => {
    console.log(canvas_buffer);
    canvas_context.putImageData(canvas_buffer, 0, 0);
}

// Models
class Vect2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    sub(vect) {
        return new Vect2(this.x - vect.x, this.y - vect.y);
    }

    dot(vect) {
        return this.x * vect.x + this.y * vect.y
    }
}

class Vect3 extends Vect2 {
    constructor(x, y, z) {
        super(x, y);
        this.z = z;
    }

    sub(vect) {
        return new Vect3(this.x - vect.x, this.y - vect.y, this.z - vect.z);
    }

    dot(vect) {
        return this.x * vect.x + this.y * vect.y + this.z * vect.z
    }
}

class Sphere {
    constructor(centre, radius, colour) {
        this.centre = centre;
        this.radius = radius;
        this.colour = colour;
    }
}

class Color {
    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    sub(num) {
        let r = this.r - num;
        if(r < 0) r = 0;
        if(r > 255) r = 255;

        let g = this.g - num;
        if(g < 0) g = 0;
        if(g > 255) g = 255;

        let b = this.b - num;
        if(b < 0) b = 0;
        if(b > 255) b = 255;
        
        return new Color(r, g, b);
    }
}

// Setup
const camPos = new Vect3(0, 0, 0);
const viewPortSize = new Vect2(1, 1);
const projectionPlaneD = 1;
const BG_COL = new Color(255, 255, 255);

const objects = [
    new Sphere(new Vect3(0, -1, 3), 1, new Color(255, 0, 0)),
    new Sphere(new Vect3(1, -0.5, 4), 1, new Color(0, 0, 255)),
    new Sphere(new Vect3(-2, 0, 4), 1, new Color(0, 255, 0))
]

// Helpers
const canvasToViewport = (x, y) => {
    return new Vect3(x * viewPortSize.x / canvas.width, y * viewPortSize.y / canvas.height, projectionPlaneD)
}

const traceRay = (O, D, t_min, t_max) => {
    let closestT = Infinity;
    let closestObject = null;

    for (let object of objects) {
        const [t1, t2] = intersectRaySphere(O, D, object);
        if (t1 >= t_min && t1 <= t_max && t1 < closestT) {
            closestT = t1;
            closestObject = object
        }

        if (t2 >= t_min && t2 <= t_max && t2 < closestT) {
            closestT = t2;
            closestObject = object
        }
    }

    if (!closestObject) {
        return BG_COL
    }

    // return closestObject.colour.sub(closestT * 20);
    return closestObject.colour;
}

const intersectRaySphere = (O, D, sphere) => {
    const r = sphere.radius;
    const CO = O.sub(sphere.centre);

    const a = D.dot(D);
    const b = 2 * CO.dot(D);
    const c = CO.dot(CO) - r * r;

    const discriminant = b * b - 4 * a * c;
    if(discriminant < 0) {
        return [Infinity, Infinity];
    }

    const t1 = (-b + Math.sqrt(discriminant)) / (2*a);
    const t2 = (-b - Math.sqrt(discriminant)) / (2*a);

    return [t1, t2];
}

// Main Loop

for (let x = -canvas.width / 2; x <= canvas.width / 2; x++) {
    for (let y = -canvas.height / 2; y <= canvas.width / 2; y++) {
        const D = canvasToViewport(x, y);
        const colour = traceRay(camPos, D, 1, Infinity);
        // console.log(colour);
        putPixel(x, y, colour);
    }
}

updateCanvas();
