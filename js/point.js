class point {
    constructor(x,y,angle=0) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.r = 4;
        this.id = pointTableCounter;
        pointTableCounter++;

        addTableRow(this);

        this.xCell = document.getElementById(`x${this.id}`);
        this.yCell = document.getElementById(`y${this.id}`);

        this.meterX = this.metersBasedOnPixels().x;
        this.meterY = this.metersBasedOnPixels().y;
    }
    set pixelX(n) {this.x = n;}
    get pixelX() {return this.x;}
    set pixelY(n) {this.y = n;}
    get pixelY() {return this.y;}

    set meterX(n) {this.xCell.value = n;}
    get meterX() {return parseInt(this.xCell.value);}
    set meterY(n) {this.yCell.value = n;}
    get meterY() {return parseInt(this.yCell.value);}
}

point.prototype.draw = function() {
    img(arrow, this.x * ratio.x, this.y * ratio.y, this.angle);
    circle(this.x * ratio.x, this.y * ratio.y, this.r, "#53e346");
}

point.prototype.update = function(pos) {
    if(circlePoint(this,pos)) {
        hoveringOverPoint = true;
    }
}

point.prototype.metersBasedOnPixels = function() {
    var fc = fieldJSONs[selectedField]["field-corners"];
    var tl = fc["top-left"];
    var br = fc["bottom-right"];
    
    var footDimensions = fieldJSONs[selectedField]["field-size"];
    var meterDimensions = [footDimensions[0] * 0.3048, footDimensions[1] * 0.3048];
    var pixelsPerMeter = [ (br[0]-tl[0]) / meterDimensions[0], (br[1]-tl[1]) / meterDimensions[1] ];

    var returnObj = {
        x: this.pixelX / pixelsPerMeter[0],
        y: ((br[1]-tl[1]) - this.pixelY) / pixelsPerMeter[1]
    }
    returnObj.x = Math.round(returnObj.x*100)/100;
    returnObj.y = Math.round(returnObj.y*100)/100;

    return returnObj;
}

function addTableRow(p) {
    var tr = document.createElement("tr");
        tr.id = `row${p.id}`
        // three inputs for x, y, anf theta
        for(var i=0;i<3;i++) {
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
        var td = document.createElement("td");
            var button = document.createElement("button");
            button.className = "redButton";
            button.innerHTML = "x";
            button.id = `${p.id}`;
            button.onclick = function() {
                var bID = parseInt(this.id);
                for(var i=0;i<points.length;i++) {
                    if(points[i].id === bID) {
                        points.splice(i,1);
                        i = points.length;
                    }
                }
                document.getElementById("pointTable").removeChild(this.parentNode.parentNode);
                save();
            };
            td.appendChild(button);
        tr.appendChild(td);

    document.getElementById("pointTable").appendChild(tr);
}