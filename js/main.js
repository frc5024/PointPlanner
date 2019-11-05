// globals, sorry

var fieldImages = []; // stores loaded field pictures
var fieldJSONs = []; // stores loaded json data
for(var i=0;i<links.length;i++) {fieldJSONs.push(null);}

var selectedField = 0; // index to access fieldJSONs at, always set to the value of the field dropdown


var points = []; // list of point objects
var pointTableCounter = 0; // what number the id should be when adding a table row

var ratio = {x:1,y:1}; // multiplier for coordinates based on how stretched the image is
var origin = {x:0,y:0,angle:0}; // point to calculate all meter positions from

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
var blueArrow = new Image();
blueArrow.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAnklEQVRYhe3XMQ7CMBBE0Z/cA3EP7q/cA3EQqCIZS4m9guxOMb9L5VesHRucc85Jt1y9wOP5erff2/0WWnP9L2dcDx6VDoQYsgQI88jLZxDOMaOZTAHuHUHPkKlAiCPTgRBDlgBhHlm2i4/q4XJA+EZKAtskge0cygH7TeJjpk/6oJb91UlfFn7BQeEunr36lwAj75J0YPTR5JxzTrwPuBZAIp80lS4AAAAASUVORK5CYII=";

// loop for resizing and drawing the field
function fieldUpdateLoop() {
    selectedField = parseInt(document.getElementById("fieldSelection").value);
    if (isNaN(selectedField)) {
        selectedField = 0;
    }
    
    resize();

    drawField(selectedField);
}

// loop for drawing the top canvas
function drawPoints() {
    //lines
    for (var i=0, l=points.length; i<l; i++) {
        if(i>0) {
            line(points[i-1].x * ratio.x, points[i-1].y * ratio.y, points[i].x * ratio.x, points[i].y * ratio.y, "#50ad4e");
        }
    }
    //points
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
    }

    // highlight row for hovered point
    if (hover.shouldShow) {
        var id = points[hover.id].id;
        document.getElementById(`x${id}`).style.backgroundColor = "#444444";
        document.getElementById(`y${id}`).style.backgroundColor = "#444444";
        document.getElementById(`angle${id}`).style.backgroundColor = "#444444";
    }

    // set origin color
    if (points.length>0) {
        document.getElementById(`x0`).style.backgroundColor = "#17827b";
        document.getElementById(`y0`).style.backgroundColor = "#17827b";
        document.getElementById(`angle0`).style.backgroundColor = "#17827b";
    }
    resetInput();
}

// clear points and switch fields when the drop down value is changed
document.getElementById("fieldSelection").onchange = function() {
    pointTableCounter = 0;
    selectedField = parseInt(document.getElementById("fieldSelection").value);
    for(var i=0, l=points.length; i<l; i++) {
        document.getElementById("pointTable").removeChild(document.getElementById(`row${points[i].id}`));
    }
    points = [];
    addOrigin();
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
setInterval(save,5000);