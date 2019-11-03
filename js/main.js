var fieldImages = [];
var fieldJSONs = [];
for(var i=0;i<links.length;i++) {fieldJSONs.push(null);}

var selectedField = 0;

var points = [];
var pointTableCounter = 0;

var ratio = {x:1,y:1};
var cursor = false;
var grabInfo = {grabbing:false, index:0, part:"point"};

var fCvs = document.getElementById("fieldImageCanvas");
var fCtx = fCvs.getContext("2d");

var pCvs = document.getElementById("pointCanvas");
var pCtx = fCvs.getContext("2d");

var arrow = new Image();
arrow.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAjUlEQVRYhe2V0Q2AIAwF0T1cxAkY2QlchEHwn8RI32uMiXff7esFLZQCH6K2vde298zMJStoFDu2MyU7JeTu1DIk7YCnT+pKWs2z/5sjKTdGl0GVlJrUTVUkww3uNRKVDBVHtzVju6cL1WGu5FSRO8TpX2cGqOFK7Ygs+BaSoHIiWW8zAAAAAAAAwJ+4AOU0P0lOgxy1AAAAAElFTkSuQmCC";

function fieldUpdateLoop() {
    selectedField = parseInt(document.getElementById("fieldSelection").value);
    if(isNaN(selectedField)) {
        selectedField = 0;
    }
    
    resize();

    drawField(selectedField);
}

function drawPoints() {
    for(var i=0, l=points.length; i<l; i++) {
        points[i].draw();
    }
    requestAnimationFrame(drawPoints);
}

function update() {
    var pos = {x:Math.round(mousePos.x / ratio.x), y:Math.round(mousePos.y / ratio.y)};

    cursor = "";

    // update points
    for(var i=0, l=points.length; i<l; i++) {
        points[i].update(pos,i);
    }

    pCvs.style.cursor = cursor;
    
    // add new point on click
    if(mousePress[0] && cursor==="") {
        points.push(new point(pos.x, pos.y));
        save();
    }

    resetInput();
}

document.getElementById("fieldSelection").onchange = function() {
    selectedField = parseInt(document.getElementById("fieldSelection").value);
    for(var i=0, l=points.length; i<l; i++) {
        document.getElementById("pointTable").removeChild(document.getElementById(`row${points[i].id}`));
    }
    points = [];
    save();
}

for(var i=0; i<links.length; i++) {
    loadField(i);
}

addListenersTo(pCvs);

setInterval(fieldUpdateLoop,50);
requestAnimationFrame(drawPoints);
setInterval(update,4);