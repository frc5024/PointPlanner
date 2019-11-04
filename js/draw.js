function drawField(fieldIndex) {
    if (fieldImages.length === links.length && fieldJSONs.length === links.length) { // if the field is ready to draw
        if (fieldImages[fieldIndex].complete) { // if the image has loaded
            var fc = fieldJSONs[fieldIndex]["field-corners"];
            var tl = fc["top-left"];
            var br = fc["bottom-right"];
            // slice out just the portion of playable field, and draw it at the scale of the canvas
            fCtx.drawImage(fieldImages[fieldIndex], tl[0], tl[1], br[0]-tl[0], br[1]-tl[1], 0, 0, fCvs.width, fCvs.height);
        }
    }
}

function circle(x,y,r,color) {
    pCtx.beginPath();
    pCtx.arc(x, y, r, 0, 2 * Math.PI, false);
    pCtx.fillStyle = color;
    pCtx.fill();
}

function img(img,x,y,angle) {
    pCtx.setTransform(1, 0, 0, 1, x, y);
    pCtx.rotate(angle);
    pCtx.drawImage(img,Math.round(-img.width/2),Math.round(-img.height/2));
    pCtx.setTransform(1, 0, 0, 1, 0, 0);
}