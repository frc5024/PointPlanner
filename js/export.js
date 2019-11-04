function downloadExport() {
    // create an array of objects with the desired x, y and angle
    var exportArr = [];
    for (var i=0,l=points.length; i<l; i++) {
        exportArr.push({x:points[i].meterY,y:points[i].meterX,theta:points[i].angle});
    }

    var fileContentsString; // actual text of the file
    var fileType; // type of file
    var fileName; // name of file

    switch (document.getElementById("exportSelection").value) {
        case "java":
            // TODO
            fileContentsString = "";
            fileType = "text/plain";
            fileName = "points.java";
            break;
        case "json":
            var s = "[\n";

            for (var i=0; i<exportArr.length; i++) {
                s += `\t{"x":${exportArr[i].x}, "y":${exportArr[i].y}, "theta": ${exportArr[i].theta}}${i!==exportArr.length-1 ? "," : ""}\n`;
            }

            s += "]";
            fileContentsString = s;
            fileType = "application/json";
            fileName = "points.json";
            break;
        default:
        case "csv":
            var s = "x,y,theta\n"; // set the first line

            // go through exportArr and add the values to the string separated by commas, with a newline at the end
            for (var i=0; i<exportArr.length; i++) {
                s += `${exportArr[i].x},${exportArr[i].y},${exportArr[i].theta}\n`;
            }

            fileContentsString = s; // set the text of the file to the string just created
            fileType = "text/csv";
            fileName = "points.csv";
            break;
        
    }

    // generate a download link
    var link = document.createElement("a");
    link.download = fileName; // set name of file
    
    var blob = new Blob([fileContentsString], {type : fileType}); // create the file
    link.href = URL.createObjectURL(blob); // set the download link to the file
    
    // click the link
    var e = document.createEvent("MouseEvents");
    e.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    link.dispatchEvent(e);
}