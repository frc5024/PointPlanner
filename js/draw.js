function drawField(fieldIndex) {
    if(fieldImages.length === links.length && fieldJSONs.length === links.length) {
        if(fieldImages[fieldIndex].complete) {
            var fc = fieldJSONs[fieldIndex]["field-corners"];
            var tl = fc["top-left"];
            var br = fc["bottom-right"];
            fCtx.drawImage(fieldImages[fieldIndex], tl[0], tl[1], br[0]-tl[0], br[1]-tl[1], 0, 0, fCvs.width, fCvs.height);
        }
    }
}