// update field selection
document.getElementById("fieldSelection").onchange = function () {
    selectedField = parseInt(document.getElementById("fieldSelection").value);
}

// get canvas
var canvas = document.getElementById("cvs");
var ctx = canvas.getContext("2d");

// arrow picture
var arrow = new Image();
arrow.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAoElEQVRYhe3XwQ3CMBBE0Z/0QSNUQMmpgEYoBE6RjKXEXkF25zD/lpPfYe3Y4JxzTrrl6gUer/u7/d5uz9Ca638543rwqHQgxJAlQJhHXj6DcI4ZzWQKcO8IeoZMBUIcmQ6EGLIECPPIsl18VA+XA8I3UhLYJgls51AO2G8SHzN90ge17K9O+rLwCw4Kd/Hs1b8EGHmXpAOjjybnnHPifQCJNUAil9eC2wAAAABJRU5ErkJggg==";

// draw field image and points
function drawLoop() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    if (fieldImages.length === links.length && fieldJSONs.length === links.length) {
        if (fieldImages[selectedField].complete) {
            var fc = fieldJSONs[selectedField]["field-corners"];
            var tl = fc["top-left"];
            var br = fc["bottom-right"];
            // slice out just the portion of playable field, and draw it at the scale of the canvas
            ctx.drawImage(fieldImages[selectedField], tl[0], tl[1], br[0] - tl[0], br[1] - tl[1], 0, 0, canvas.width, canvas.height);
        }
    }

    var rows = document.getElementById("pointTable").rows;
    for (var i = 1; i < rows.length; i++) {
        var x = parseFloat(document.getElementById(`x${i - 1}`).value);
        var y = parseFloat(document.getElementById(`y${i - 1}`).value);
        var angle = parseFloat(document.getElementById(`angle${i - 1}`).value);
        var pos = pixelsBasedOnMeters(x, y);

        img(arrow, pos.x, pos.y, angle);

        txt(`${i}`, pos.x - 5, pos.y + 5);
    }

    requestAnimationFrame(drawLoop);
}
requestAnimationFrame(drawLoop);

function txt(str, x, y) {
    ctx.strokeStyle = "white";
    ctx.font = `24px consolas`;
    ctx.strokeText(str, x - 1, y + 1)
    ctx.font = `20px consolas`;
    ctx.fillStyle = "black";
    ctx.fillText(str, x, y);
}

function img(img, x, y, angle) {
    ctx.setTransform(1, 0, 0, 1, x, y);
    ctx.rotate(degToRad(angle));
    ctx.drawImage(img, Math.round(-img.width / 2), Math.round(-img.height / 2));
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function pixelsBasedOnMeters(meterX, meterY) {
    var fc = fieldJSONs[selectedField]["field-corners"];
    var tl = fc["top-left"];
    var br = fc["bottom-right"];

    var footDimensions = fieldJSONs[selectedField]["field-size"];
    var meterDimensions = [footDimensions[0] * 0.3048, footDimensions[1] * 0.3048];
    var pixelsPerMeter = [(br[0] - tl[0]) / meterDimensions[0], (br[1] - tl[1]) / meterDimensions[1]];

    var returnObj = {
        x: (meterX) * pixelsPerMeter[0],
        y: (FieldHeight * pixelsPerMeter[1]) - (-(((meterY + FieldHeight / 2) * pixelsPerMeter[1]) - (br[1] - tl[1])))
    };

    returnObj.x = Math.round(returnObj.x * ratio.x);
    returnObj.y = Math.round(returnObj.y * ratio.y);

    return returnObj;
}

// get ratio for positioning
function resize() {
    // get size and position of field div
    var f = document.getElementById("cvs");
    canvas.width = f.clientWidth;
    canvas.height = f.clientHeight;

    // calculate the ratio of how stretched the field picture is 
    if (fieldJSONs[selectedField] !== null) {
        var fc = fieldJSONs[selectedField]["field-corners"];
        var tl = fc["top-left"];
        var br = fc["bottom-right"];
        ratio = {
            x: (f.clientWidth / (br[0] - tl[0])),
            y: (f.clientHeight / (br[1] - tl[1]))
        }
        FieldHeight = fieldJSONs[selectedField]["field-size"][1] / 3.281;
    }
}
setInterval(resize, 50);