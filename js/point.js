class point {
    constructor(x,y,angle=0,type="point") {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.r = type==="origin"?7:5;
        this.id = pointTableCounter;
        this.type = type;
        pointTableCounter++;

        addTableRow(this);

        this.xCell = document.getElementById(`x${this.id}`);
        this.yCell = document.getElementById(`y${this.id}`);
        this.angleCell = document.getElementById(`angle${this.id}`);

        this.meterX = this.metersBasedOnPixels().x;
        this.meterY = this.metersBasedOnPixels().y;
        this.theta = this.thetaBasedOnAngle();
    }
    // get and set position in pixels from top left
    set pixelX(n) {this.x = n;}
    get pixelX() {return this.x;}
    set pixelY(n) {this.y = n;}
    get pixelY() {return this.y;}

    // get and set position in meters from bottom left
    set meterX(n) {this.xCell.value = n;}
    get meterX() {return parseFloat(this.xCell.value);}
    set meterY(n) {this.yCell.value = -n;}
    get meterY() {return -parseFloat(this.yCell.value);}

    // get and set angle number in the table
    set theta(n) {this.angleCell.value = (n > 180 ? -(360 - n) : n);}
    get theta() {
        var n=parseInt(this.angleCell.value);
        return (n<0 ? 180+(180+(n)) : n);
    }
}

point.prototype.draw = function() {
    if(this.type === "origin") {
        img(blueArrow, this.x * ratio.x, this.y * ratio.y, degToRad(this.angle));
        circle(this.x * ratio.x, this.y * ratio.y, this.r, "#3ae0e3");
    } else {
        img(arrow, this.x * ratio.x, this.y * ratio.y, degToRad(this.angle));
        circle(this.x * ratio.x, this.y * ratio.y, this.r, "#53e346");
    }
}

// Takes a mouse position, and the index of the point in the points array as an argument
point.prototype.update = function(pos,i) {
    if (!grabInfo.grabbing) { // if nothing is grabbed

        // point
        if (circlePoint(this,pos)) { // if the point is hovered over
            cursor = "grab";
            if (mouseDown[0]) { // if the point is clicked set the grabbing info to grabbing this point
                cursor = "grabbing";
                grabInfo.grabbing = true;
                grabInfo.index = i;
                grabInfo.part = "point"; 
            }
            // highlight the table row the represents this point
            hover.shouldShow = true;
            hover.id = i;
        }

        // calculate positions of hit boxes of the arrow
        var angleInRadians = degToRad(this.angle);

        // middle hit box
        var arrowMid = {};
        arrowMid.x = this.x + 12 * Math.sin(angleInRadians + Math.PI/2);
        arrowMid.y = this.y - 12 * Math.cos(angleInRadians + Math.PI/2);
        arrowMid.r = 6;

        // left hit box
        var arrowLeft = {};
        arrowLeft.x = (this.x + 9 * Math.sin(angleInRadians)) + (8 * Math.sin(angleInRadians + Math.PI/2));
        arrowLeft.y = (this.y - 9 * Math.cos(angleInRadians)) - (8 * Math.cos(angleInRadians + Math.PI/2));
        arrowLeft.r = 4;

        // right hit box
        var arrowRight = {};
        arrowRight.x = (this.x - 9 * Math.sin(angleInRadians)) + (8 * Math.sin(angleInRadians + Math.PI/2));
        arrowRight.y = (this.y + 9 * Math.cos(angleInRadians)) - (8 * Math.cos(angleInRadians + Math.PI/2));
        arrowRight.r = 4;

        // arrow
        if (circlePoint(arrowMid,pos) || circlePoint(arrowLeft,pos) || circlePoint(arrowRight,pos)) { // if the arrow is hovered over
            cursor = "move";
            if (mouseDown[0]) { // if the arrow is clicked set the grabbing info to grabbing this arrow
                cursor = "grabbing";
                grabInfo.grabbing = true;
                grabInfo.index = i;
                grabInfo.part = "arrow";
            }
            // highlight the table row the represents this point
            hover.shouldShow = true;
            hover.id = i;
        }
    }

    if (grabInfo.grabbing && grabInfo.index === i) { // if this being grabbed
        if (grabInfo.part === "point") { // if the point is grabbed
            cursor = "grabbing";
            // set pixel positions to mouse position
            if(this.type === "origin") {
                for(var i=0;i<points.length;i++) {
                    if(points[i].type !== "origin") {
                        points[i].x += this.pixelX - pos.x;
                        points[i].y += this.pixelY - pos.y;
                        points[i].meterX = points[i].metersBasedOnPixels().x;
                        points[i].meterY = points[i].metersBasedOnPixels().y;
                    }
                }
            }

            this.pixelX = pos.x;
            this.pixelY = pos.y;

            // calculate and set the meter positions
            this.meterX = this.metersBasedOnPixels().x;
            this.meterY = this.metersBasedOnPixels().y;

            // if the mouse is not held, stop being grabbed
            if (!mouseDown[0]) {
                grabInfo.grabbing = false;
            }
        }
        if (grabInfo.part === "arrow") { // if the arrow is grabbed
            cursor = "grabbing";
            // get angle pointing towards mouse in degrees
            var angleToSet = limitAngle(Math.round(radToDeg(pointTo(this,pos))));

            if(this.type === "origin") {
                for(var i=0;i<points.length;i++) {
                    if(points[i].type !== "origin") {
                        points[i].angle += this.angle - angleToSet;
                        points[i].theta = points[i].thetaBasedOnAngle();
                    }
                }
            }

            // set this angle
            this.angle = angleToSet;

            this.theta = this.thetaBasedOnAngle();

            // if the mouse is not held, stop being grabbed
            if (!mouseDown[0]) {
                grabInfo.grabbing = false;
            }
        }
    }

    // if inputs in table are different from this point's values, set this point's values to the values in the table
    var meters = this.metersBasedOnPixels();

    if(this.type === "origin") {
        if(this.meterX !== meters.x || this.meterY !== meters.y || this.angle !== this.theta) {
            var difX = this.pixelX - this.pixelsBasedOnMeters().x;
            var difY = this.pixelY - this.pixelsBasedOnMeters().y;
            var difA = this.angle - this.theta;
            if(isNaN(difX)) {difX=0;}
            if(isNaN(difY)) {difY=0;}
            if(isNaN(difA)) {difA=0;}
            for(var i=0;i<points.length;i++) {
                if(points[i].type !== "origin") {
                    points[i].x += difX;
                    points[i].y += difY;
                    points[i].meterX = points[i].metersBasedOnPixels().x;
                    points[i].meterY = points[i].metersBasedOnPixels().y;
                    points[i].angle += difA;
                    points[i].theta = points[i].thetaBasedOnAngle();
                }
            }
        }
    }

    if (this.meterX !== meters.x) {this.pixelX = this.pixelsBasedOnMeters().x;}
    if (this.meterY !== meters.y) {this.pixelY = this.pixelsBasedOnMeters().y;}
    if (this.thetaBasedOnAngle() !== this.theta) {this.angle = this.angleBasedOnTheta();}

    if (this.type === "origin") {
        origin.x = isNaN(this.meterX)?0:this.meterX;
        origin.y = isNaN(this.meterY)?0:this.meterY;
        origin.angle = isNaN(this.theta)?0:this.theta;
    }
}

// returns an object with and x and y property representing meter distance from the bottom left corner of the field. Calculated with pixels
point.prototype.metersBasedOnPixels = function() {
    var fc = fieldJSONs[selectedField]["field-corners"];
    var tl = fc["top-left"];
    var br = fc["bottom-right"];
    
    var footDimensions = fieldJSONs[selectedField]["field-size"];
    var meterDimensions = [footDimensions[0] * 0.3048, footDimensions[1] * 0.3048];
    var pixelsPerMeter = [ (br[0]-tl[0]) / meterDimensions[0], (br[1]-tl[1]) / meterDimensions[1] ];

    var returnObj = {
        x: (this.pixelX / pixelsPerMeter[0]) - (this.type==="point"?origin.x:0),
        y: ((br[1]-tl[1]- this.pixelY) / pixelsPerMeter[1]) - (this.type==="point"?origin.y:0)
    }
    returnObj.x = Math.round(returnObj.x*100)/100;
    returnObj.y = Math.round(returnObj.y*100)/100;

    return returnObj;
}

// returns an object with and x and y property representing pixel distance from the top left corner of the field. Calculated with meters
point.prototype.pixelsBasedOnMeters = function() {
    var fc = fieldJSONs[selectedField]["field-corners"];
    var tl = fc["top-left"];
    var br = fc["bottom-right"];

    var footDimensions = fieldJSONs[selectedField]["field-size"];
    var meterDimensions = [footDimensions[0] * 0.3048, footDimensions[1] * 0.3048];
    var pixelsPerMeter = [ (br[0]-tl[0]) / meterDimensions[0], (br[1]-tl[1]) / meterDimensions[1] ];

    var returnObj = {
        x: (this.meterX + (this.type==="point"?origin.x:0)) * pixelsPerMeter[0], 
        y: -(((this.meterY + (this.type==="point"?origin.y:0)) * pixelsPerMeter[1]) - (br[1]-tl[1]))
    };

    returnObj.x = Math.round(returnObj.x);
    returnObj.y = Math.round(returnObj.y);
    
    return returnObj;
}

point.prototype.thetaBasedOnAngle = function() {
    return limitAngle(this.angle-(this.type==="point"?origin.angle:0));
}

point.prototype.angleBasedOnTheta = function() {
    return limitAngle(this.theta+(this.type==="point"?origin.angle:0));
}

// adds a table row containing x, y, and theta inputs, and a delete button. Takes a point as an argument
function addTableRow(p) {
    var tr = document.createElement("tr");
        tr.id = `row${p.id}`
        // three inputs for x, y, and theta
        for (var i=0; i<3; i++) {
            var td = document.createElement("td");
                var input = document.createElement("input");
                input.className = "number";
                switch(i) {
                    case 0:
                        input.value = p.x;
                        input.id = `x${p.id}`;
                        break;
                    case 1:
                        input.value = p.y;
                        input.id = `y${p.id}`;
                        break;
                    case 2:
                        input.value = p.angle;
                        input.id = `angle${p.id}`;
                        break;
                }
                td.appendChild(input);
            tr.appendChild(td);
        }

        // delete button
        if(p.type === "origin") {
            var td = document.createElement("td");
            tr.appendChild(td);
        } else {
            var td = document.createElement("td");
                var button = document.createElement("button");
                button.className = "redButton";
                button.innerHTML = "x";
                button.id = `${p.id}`;
                button.onclick = function() {
                    var bID = parseInt(this.id);
                    for (var i=0;i<points.length;i++) {
                        if (points[i].id === bID) {
                            points.splice(i,1);
                            i = points.length;
                        }
                    }
                    document.getElementById("pointTable").removeChild(this.parentNode.parentNode);
                    save();
                };
                td.appendChild(button);
            tr.appendChild(td);
        }

    document.getElementById("pointTable").appendChild(tr);
}