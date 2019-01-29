
const V4aPatterns = require('./V4aPatterns.js');

function clamp(c) {
    if (c < 0) return 0;
    if (c > 255) return 255;
    return c;
}

// offets into data
const R = 0, G = 1, B = 2, A = 3;

function VisualsForAudio(image) {
    this.image = image;
    this.bpp = 4;
    this.stride = image.bitmap.width * this.bpp;
}

var patterns = new V4aPatterns();

VisualsForAudio.WHITE = { r: 0xff, g: 0xff, b: 0xff, a: 0xff };
VisualsForAudio.BLACK = { r: 0x00, g: 0x00, b: 0x00, a: 0xff };

/**
 * Calculates the memory location of a pixel within an image.
 * 
 * @param {number} x horizontal location, from left to right
 * @param {number} y vertical location, from top to bottom
 * @returns {number} offset into bitmap data
 */
VisualsForAudio.prototype._offset = function (x, y) {
    return this.stride * parseInt(y)
        + this.bpp * parseInt(x);
};

/**
 * Sets a pixel within the bitmap
 * @param {number} x position
 * @param {number} y position
 * @param {number} r red
 * @param {number} g green
 * @param {number} b blue
 * @param {number} a alpha default is 0xff
 */
VisualsForAudio.prototype.pixel = function (x, y, r, g, b, a) {
    a = typeof a !== 'undefined' ? a : 0xff;

    var idx = this._offset(x, y);
    this.image.bitmap.data[idx + R] = parseInt(r);
    this.image.bitmap.data[idx + G] = parseInt(g);
    this.image.bitmap.data[idx + B] = parseInt(b);
    this.image.bitmap.data[idx + A] = parseInt(a);
};

/**
 * Very simple line drawing algorithm.
 * @param {any} x0 start x
 * @param {any} y0 start y
 * @param {any} x1 end x
 * @param {any} y1 end y
 * @param {any} r red
 * @param {any} g green
 * @param {any} b blue
 */
VisualsForAudio.prototype.line = function (x0, y0, x1, y1, r, g, b) {
    var x, y, t;
    if (x0 === x1) { // asymtope
        x = x0;
        if (y1 < y0) {
            t = x1; x1 = x0; x0 = t;
            t = y1; y1 = y0; y0 = t;
        }
        for (y = y0; y <= y1; y++) {
            this.pixel(x, y, r, g, b);
        }
    }
    else {
        if (x1 < x0) {
            t = x1; x1 = x0; x0 = t;
            t = y1; y1 = y0; y0 = t;
        }
        var stepY = (y1 - y0) / (x1 - x0);
        var stepX = 1;
        y = y0;
        for (x = x0; x <= x1; x += stepX, y += stepY) {
            this.pixel(x, y, r, g, b);
        }
    }
};

/**
 * Draws lines between a series of points.
 * 
 * @param {array} array objects of {x,y}
 * @param {object} color {r,g,b,a}
 */
VisualsForAudio.prototype.shape = function (array, color) {
    var p0, p1;
    for (var i = 0, len = array.length - 1; i < len; i++) {
        p0 = array[i];
        p1 = array[i + 1];
        this.line(p0.x, p0.y, p1.x, p1.y, color.r, color.g, color.b);
    }
    p0 = array[0];
    p1 = array[array.length - 1];
    this.line(p0.x, p0.y, p1.x, p1.y, color.r, color.g, color.b);
};

VisualsForAudio.prototype.rect = function (x, y, w, h, color, rot) {
    rot = typeof rot !== 'undefined' ? rot : 0;
    rot += Math.PI / 4; // default corner for a square, let's rotate from that
    var array = patterns.elipse(x, y, w, h, 4, rot);
    this.shape(array, color);
};

/**
 * Renders a cute little things across all pixels.
 * 
 * @param {any} t current time
 */
VisualsForAudio.prototype.perPixelFormula = function (t) {
    this.image.scan(0, 0, this.image.bitmap.width, this.image.bitmap.height, function (x, y, idx) {
        // the tangent makes this one fun
        this.bitmap.data[idx + R] = clamp(128 + Math.cos(x / 100.0 + t * 0.017) * 100.0);
        this.bitmap.data[idx + G] = clamp(128 + Math.tan(x * t * 0.003 + y * 0.1) * 20.0);
        this.bitmap.data[idx + B] = clamp(128 + Math.sin(y / 100.0 + t * 0.13) * 100.0);
        this.bitmap.data[idx + A] = 255;
    });
};

/**
 * Draws a sine wave over an image.
 * 
 * @param {number} t time component of theta
 * @param {number} mag scale of sine wave
 */
VisualsForAudio.prototype.drawSine = function (t, mag) {
    var y0 = this.image.bitmap.height / 2;

    var dt = 0.01; // delta for drawing lines
    var dx = 0.01;
    for (var x = 0; x < this.image.bitmap.width; x += dx) {
        var y = y0 + Math.cos((x + t * 5) * 0.3) * mag;
        var x2 = x + dx;
        var t2 = t + dt;
        var y2 = y0 + Math.cos((x2 + t2 * 5) * 0.3) * mag;
        this.line(x, y, x2, y2, 0xff, 0xff, 0x0);
    }
};

module.exports = VisualsForAudio;
