function updateCode() {
    var str = "";
    var rows = document.getElementById("pointTable").rows;
    if(rows.length>1) {
        for(var i=1;i<rows.length;i++) {
            var angle = parseFloat(document.getElementById(`angle${i-1}`).value);
            var error = parseFloat(document.getElementById(`epsilon${i-1}`).value);
            var x = parseFloat(document.getElementById(`x${i-1}`).value);
            var y = parseFloat(document.getElementById(`y${i-1}`).value);
            var speed = parseFloat(document.getElementById(`speed${i-1}`).value);
            var accel = parseFloat(document.getElementById(`accel${i-1}`).value);
            // user desired turn
            if (i!==1) {
                str += turnCommand(angle,error);
            }

            if(i<rows.length-1) {
                // turn to next point
                var x2 = parseFloat(document.getElementById(`x${i}`).value);
                var y2 = parseFloat(document.getElementById(`y${i}`).value);
                var pointToAngle = pointTo(x,y,x2,y2)
                pointToAngle = Math.round(pointToAngle > 180 ? -(360 - pointToAngle) : pointToAngle);
                str += turnCommand(pointToAngle,error);

                // move to next point
                str +=  moveCommand(x2,y2,speed,accel,pointToAngle);
            }
        }
        document.getElementById("codespan").innerHTML = str;

        // var x = parseFloat(document.getElementById(`x0`).value);
        // var y = parseFloat(document.getElementById(`y0`).value);
        // var angle = parseFloat(document.getElementById(`angle0`).value);
        // document.getElementById("initialPos").innerHTML = `<span class="purple">return new</span> <span class="yellow">Pose2d</span>(${x},${y},Rotation2d</span>.<span class="yellow">fromDegrees</span>(${angle})));`;
        var angle = parseFloat(document.getElementById(`angle0`).value);
        var error = parseFloat(document.getElementById(`epsilon0`).value);
        document.getElementById("startAngle").innerHTML = `<span class="blue">output</span>.<span class="yellow">addCommands</span>(<span class="purple">new</span> <span class="yellow">TurnToCommand</span>((${angle}), ${error}));`;
    }
}

function turnCommand(angle,epsilon) {
    return `\t<span class="blue">output</span>.<span class="yellow">addCommands</span>(<span class="purple">new</span> <span class="yellow">TurnToCommand</span>(<span class="blue">Rotation2d</span>.<span class="yellow">fromDegrees</span>(${angle}), ${epsilon}));\n\n`;
}

function moveCommand(x,y,speed,accel,angle) {
    return `\t<span class="blue">output</span>.<span class="yellow">addCommands</span>(<span class="purple">new</span> <span class="yellow">DriveToCommand</span>(<span class="purple">new<span> <span class="yellow">Pose2d</span>(${x}, ${y}, <span class="blue">Rotation2d</span>.<span class="yellow">fromDegrees</span>(${angle})),<span class="purple">new</span> <span class="yellow">SpeedConstraint</span>(${speed}, ${accel}), <span class="lightblue">false</span>));\n\n`;
}

function pointTo(x1,y1,x2,y2) {
    var adjacent = (x2 - x1);
    var opposite = (y2 - y1);
    var h = Math.atan2(opposite, adjacent);
    return radToDeg(h);
}

function radToDeg(rad) {return rad / Math.PI * 180;}

setInterval(updateCode,50);