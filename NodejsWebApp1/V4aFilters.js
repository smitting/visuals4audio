//
// Image filters such as blur
//


function clamp(c) {
    //return c;
    if (c < 0) return 0;
    if (c > 255) return 255;
    return c;
}

function V4aFilters() {

}

V4aFilters.prototype.blur = function (visuals, strength) {

    if (!visuals) return;
    if (!visuals.image) return;

    strength = typeof strength !== 'undefined' ? strength : 1.0;

    var bpp = visuals.bpp;
    var stride = visuals.stride;
    var bmp = visuals.image.bitmap;
    var w = bmp.width;
    var h = bmp.height;

    var idx;
    for (var y = 1; y < h - 1; y++) {        
        idx = y * stride;
        for (var x = 1; x < w - 1; x++) {
            for (var z = 0; z < bpp; z++) {
                // add pixel value to nearby pixels.
                var p = bmp.data[idx];
                

                bmp.data[idx - bpp] = clamp(bmp.data[idx - bpp] * 0.75 + p * 0.25 * strength);
                bmp.data[idx + bpp] = clamp(bmp.data[idx + bpp] * 0.75 + p * 0.25 * strength);
                bmp.data[idx - stride] = clamp(bmp.data[idx - stride] * 0.75 + p * 0.25 * strength);
                bmp.data[idx + stride] = clamp(bmp.data[idx + stride] * 0.75 + p * 0.25 * strength);
                bmp.data[idx - bpp - stride] = clamp(bmp.data[idx - bpp - stride] * 0.9 + p * 0.1 * strength);
                bmp.data[idx - bpp + stride] = clamp(bmp.data[idx - bpp + stride] * 0.9 + p * 0.1 * strength);
                bmp.data[idx + bpp - stride] = clamp(bmp.data[idx + bpp - stride] * 0.9 + p * 0.1 * strength);
                bmp.data[idx + bpp + stride] = clamp(bmp.data[idx + bpp + stride] * 0.9 + p * 0.1 * strength);


                /*
                bmp.data[idx] = bmp.data[idx] * 0.5
                    + bmp.data[idx + bpp] * 0.25
                    + bmp.data[idx + stride] * 0.25;*/
                idx++;
            }            
        }
    }


};

module.exports = V4aFilters;