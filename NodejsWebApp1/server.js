'use strict';

const Jimp = require('Jimp');
const VisualsForAudio = require('./VisualsForAudio.js');
const V4aPatterns = require('./V4aPatterns.js');
const V4aFilters = require('./V4aFilters.js');

const FRAMES = 300;
const T_START = 0;
const T_STEP = 1;

var t = T_START;
var frame = 0;

let patterns = new V4aPatterns();
let filters = new V4aFilters();

function circleOfSquares(visuals, t) {
    var midx = visuals.image.bitmap.width / 2;
    var midy = visuals.image.bitmap.height / 2;

    var rot = Math.PI * 2 / 100 * t;
    var sides = parseInt(6 + Math.sin(t/10.0) * 3);//parseInt(t / 10);
    var p = patterns.spiral(midx, midy, 0, t, 23, rot);
    for (var i = 0; i < p.length; i++) {
        //visuals.rect(p[i].x, p[i].y, 10, 10, VisualsForAudio.WHITE, rot);
        visuals.shape(
            patterns.elipse(p[i].x, p[i].y, 10, 10, sides, rot),
            VisualsForAudio.WHITE
        );
    }
}

function processNextFrame() {

    function zeropad(n, l) {
        var ret = '' + n;
        while (ret.length < l) {
            ret = '0' + ret;
        }
        return ret;
    }

    function processFrame() {
        let image = new Jimp(400, 400, function (err, image) {
            if (err) throw err;
            let visuals = new VisualsForAudio(image);
            visuals.perPixelFormula(t);
            visuals.drawSine(t, 200 * (t / 100));
            filters.blur(visuals, 0.1);
            circleOfSquares(visuals, t);
            //filters.blur(visuals, 0.1);


            var filename = 'img/test' + zeropad(t, 3) + '.png';
            image.write(filename, (err) => {
                if (err) throw err;
                processNextFrame();
            });
        });
    }

    t += T_STEP;    
    if (++frame < FRAMES) {
        process.stdout.write('Frame ' + (frame + 1) + ' of ' + FRAMES + '   \r');
        processFrame();
    }
    else {
        process.stdout.write('\n');
    }
}

processNextFrame();
