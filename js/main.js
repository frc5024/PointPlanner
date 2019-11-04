// globals, sorry

var fieldImages = []; // stores loaded field pictures
var fieldJSONs = []; // stores loaded json data
for(var i=0;i<links.length;i++) {fieldJSONs.push(null);}

var selectedField = 0; // index to access fieldJSONs at, always set to the value of the field dropdown


var points = []; // list of point objects
var pointTableCounter = 0; // what number the id should be when adding a table row

var ratio = {x:1,y:1}; // multiplier for coordinates based on how stretched the image is


var cursor = ""; // cursor to show when pointer is over canvas
var hover = {shouldShow:false,id:0}; // used for determining if a row should be highlighted when the respective point is hovered over
var grabInfo = {grabbing:false, index:0, part:"point"}; // tracks what point and what part of the point is or isn't being grabbed 

// bottom canvas for field image 
var fCvs = document.getElementById("fieldImageCanvas");
var fCtx = fCvs.getContext("2d");

// top canvas for points
var pCvs = document.getElementById("pointCanvas");
var pCtx = fCvs.getContext("2d");

// arrow picture
var arrow = new Image();
arrow.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAoElEQVRYhe3XwQ3CMBBE0Z/0QSNUQMmpgEYoBE6RjKXEXkF25zD/lpPfYe3Y4JxzTrrl6gUer/u7/d5uz9Ca638543rwqHQgxJAlQJhHXj6DcI4ZzWQKcO8IeoZMBUIcmQ6EGLIECPPIsl18VA+XA8I3UhLYJgls51AO2G8SHzN90ge17K9O+rLwCw4Kd/Hs1b8EGHmXpAOjjybnnHPifQCJNUAil9eC2wAAAABJRU5ErkJggg==";

// loop for resizing and drawing the field
function fieldUpdateLoop() {
    selectedField = parseInt(document.getElementById("fieldSelection").value);
    if (isNaN(selectedField)) {
        selectedField = 0;
    }
    
    resize();

    drawField(selectedField);
}

// loop for drawing the points onto the top canvas
function drawPoints() {
    for (var i=0, l=points.length; i<l; i++) {
        points[i].draw();
    }
    requestAnimationFrame(drawPoints);
}

// loop for handling point moving logic
function update() {
    // real position on the field picture in pixels
    var pos = {x:Math.round(mousePos.x / ratio.x), y:Math.round(mousePos.y / ratio.y)};

    // reset cursor and any highlighting
    cursor = "";
    if (hover.shouldShow) {
        var id = points[hover.id].id;
        document.getElementById(`x${id}`).style.backgroundColor = "";
        document.getElementById(`y${id}`).style.backgroundColor = "";
        document.getElementById(`angle${id}`).style.backgroundColor = "";
        hover.shouldShow = false;
    }

    // update points
    for (var i=0, l=points.length; i<l; i++) {
        points[i].update(pos,i);
    }

    // update cursor css for top canvas
    pCvs.style.cursor = cursor;
    
    // add new point on click if nothing is being grabbed
    if (mousePress[0] && cursor==="") {
        points.push(new point(pos.x, pos.y));
        save();
    }

    // highlight row for hovered point
    if(hover.shouldShow) {
        var id = points[hover.id].id;;
        document.getElementById(`x${id}`).style.backgroundColor = "#444444";
        document.getElementById(`y${id}`).style.backgroundColor = "#444444";
        document.getElementById(`angle${id}`).style.backgroundColor = "#444444";
    }

    resetInput();
}

// clear points and switch fields when the drop down value is changed
document.getElementById("fieldSelection").onchange = function() {
    selectedField = parseInt(document.getElementById("fieldSelection").value);
    for(var i=0, l=points.length; i<l; i++) {
        document.getElementById("pointTable").removeChild(document.getElementById(`row${points[i].id}`));
    }
    points = [];
    save();
}

// start loading data for the fields using links found in fieldLinks.js
for(var i=0; i<links.length; i++) {
    loadField(i);
}

// initialize input
addListenersTo(pCvs);

// start loops
setInterval(fieldUpdateLoop,50);
requestAnimationFrame(drawPoints);
setInterval(update,4);