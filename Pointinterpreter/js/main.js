// updates the preview code
function updateCode() {
    // create string that will be the final output
    var str = "";
    // get all points
    var rows = document.getElementById("pointTable").rows;

    // got through all points if there are any
    if (rows.length > 1) {
        for (var i = 1; i < rows.length; i++) {

            // get value of every cell in row
            var angle = parseFloat(document.getElementById(`angle${i - 1}`).value);
            var error = parseFloat(document.getElementById(`epsilon${i - 1}`).value);
            var x = parseFloat(document.getElementById(`x${i - 1}`).value);
            var y = parseFloat(document.getElementById(`y${i - 1}`).value);
            var speed = parseFloat(document.getElementById(`speed${i - 1}`).value);
            var accel = parseFloat(document.getElementById(`accel${i - 1}`).value);

            // turn to user desired turn if it is not the first point
            if (i !== 1) {
                str += turnCommand(angle, error);
            }

            // if it is not the last point
            if (i < rows.length - 1) {

                // get the angle from current point, to next point
                var x2 = parseFloat(document.getElementById(`x${i}`).value);
                var y2 = parseFloat(document.getElementById(`y${i}`).value);
                var pointToAngle = pointTo(x, y, x2, y2)
                pointToAngle = Math.round(pointToAngle > 180 ? -(360 - pointToAngle) : pointToAngle);

                // turn to next point if not close enough to the angle
                if (Math.abs(pointToAngle - angle) < 5) {
                    str += turnCommand(pointToAngle, error);
                }

                // move to next point
                str += moveCommand(x2, y2, speed, accel, pointToAngle);
            }
        }

        // update main code block
        document.getElementById("codespan").innerHTML = str;

        // update getStartingPos
        var x = parseFloat(document.getElementById(`x0`).value);
        var y = parseFloat(document.getElementById(`y0`).value);
        var angle = parseFloat(document.getElementById(`angle0`).value);
        document.getElementById("initialPos").innerHTML = `<span class="purple">return new</span> <span class="yellow">Pose2d</span>(${x}, ${y}, <span class="blue">Rotation2d</span>.<span class="yellow">fromDegrees</span>(${angle})));`;
        
        // update first turn to command
        var angle = parseFloat(document.getElementById(`angle0`).value);
        var error = parseFloat(document.getElementById(`epsilon0`).value);
        document.getElementById("startAngle").innerHTML = `<span class="blue">output</span>.<span class="yellow">addCommands</span>(<span class="purple">new</span> <span class="yellow">TurnToCommand</span>(<span class="blue">Rotation2d</span>.<span class="yellow">fromDegrees</span>(${angle}), ${error}));`;

        // update package name
        document.getElementById("packageName").innerHTML = document.getElementById("packageNameInput").value;

        // update path name
        document.getElementById("pathName").innerHTML = document.getElementById("pathNameInput").value;
    }
}

// return the text for a turn command with css formating
function turnCommand(angle, epsilon) {
    return `\t\t<span class="blue">output</span>.<span class="yellow">addCommands</span>(<span class="purple">new</span> <span class="yellow">TurnToCommand</span>(<span class="blue">Rotation2d</span>.<span class="yellow">fromDegrees</span>(${angle}), ${epsilon}));\n\n`;
}

// return the text for a move command with css formating
function moveCommand(x, y, speed, accel, angle) {
    return `\t\t<span class="blue">output</span>.<span class="yellow">addCommands</span>(<span class="purple">new</span> <span class="yellow">DriveToCommand</span>(<span class="purple">new<span> <span class="yellow">Pose2d</span>(${x}, ${y}, <span class="blue">Rotation2d</span>.<span class="yellow">fromDegrees</span>(${angle})),<span class="purple">new</span> <span class="yellow">SpeedConstraint</span>(${speed}, ${accel}), <span class="lightblue">false</span>));\n\n`;
}

// returns the angle point one should be at to point to point two
function pointTo(x1, y1, x2, y2) {
    var adjacent = (x2 - x1);
    var opposite = (y2 - y1);
    var h = Math.atan2(opposite, adjacent);
    return radToDeg(h);
}

function radToDeg(rad) { return rad / Math.PI * 180; }
function degToRad(deg) {return deg * Math.PI / 180;}

// update the code preview every at 20 fps
setInterval(updateCode, 50);