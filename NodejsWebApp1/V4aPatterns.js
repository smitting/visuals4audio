//
// V4aPatterns.js
//
// Module providing the creation of several location placement algorithms
// useful for dynamic drawing of primitives, without the actual drawing routines.
//

function V4aPatterns() {

}

/**
 * Returns points around a circle.
 * 
 * @param {any} x midpoint
 * @param {any} y midpoint
 * @param {any} rad radius
 * @param {any} steps number of points
 * @param {any} rot rotation of circle
 * @returns {array} array of objects with {x,y}
 */
V4aPatterns.prototype.circle = function (x, y, rad, steps, rot) {
    rot = typeof rot !== 'undefined' ? rot : 0;

    return this.elipse(x, y, rad, rad, steps, rot);
};

/**
 * Returns points around an elipse.
 * 
 * @param {any} x midpoint
 * @param {any} y midpoint
 * @param {any} radx radius
 * @param {any} rady radius
 * @param {any} steps number of points
 * @param {any} rot rotation of elipse
 * @returns {array} array of objects with {x,y}
 */
V4aPatterns.prototype.elipse = function (x, y, radx, rady, steps, rot) {
    rot = typeof rot !== 'undefined' ? rot : 0;
    var ret = [];
    var dTheta = Math.PI * 2 / steps;
    var theta = rot;
    for (var i = 0; i < steps; i++ , theta += dTheta) {
        var x0 = x + Math.cos(theta) * radx;
        var y0 = y + Math.sin(theta) * rady;
        ret.push({ x: x0, y: y0 });
    }
    return ret;
};

/**
 * Draws a spiral pattern.
 * 
 * @param {any} x midpoint
 * @param {any} y midpoint
 * @param {any} minRad start radius
 * @param {any} maxRad end radius
 * @param {any} steps number of points
 * @param {any} rot starting rotation
 * @returns {array} array of objects with {x,y}
 */
V4aPatterns.prototype.spiral = function (x, y, minRad, maxRad, steps, rot) {
    rot = typeof rot !== 'undefined' ? rot : 0;
    var ret = [];
    var dTheta = Math.PI * 2 / steps;
    var dRad = (maxRad - minRad) / steps;

    var theta = rot;
    var rad = minRad;
    for (var i = 0; i < steps; i++ , theta += dTheta, rad += dRad) {
        var x0 = x + Math.cos(theta) * rad;
        var y0 = y + Math.sin(theta) * rad;
        ret.push({ x: x0, y: y0 });
    }
    return ret;
};

module.exports = V4aPatterns;
