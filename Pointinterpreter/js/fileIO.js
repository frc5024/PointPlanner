// load csv when file is selected
document.getElementById("fileUpload").onchange = function () {
    if (document.getElementById("fileUpload").files[0] !== undefined) {
        var link = URL.createObjectURL(document.getElementById("fileUpload").files[0]);
        fetch(link).then((response) => response.text().then((data) => { parseData(data); }));
    }
}
// convert csv into html table
function parseData(txt) {
    while (document.getElementById(`pointTable`).rows.length>1) {
        document.getElementById(`pointTable`).deleteRow(1);
    }

    idCount = 0;

    var lines = txt.split("\n");
    for(var i=1;i<lines.length-1;i++) {
        var line = lines[i].split(",");
        line.push(2);
        line.push(1);
        line.push(1);
        addTableRow(line);
    }
}

var idCount = 0;
function addTableRow(csvLine) {
    var tr = document.createElement("tr");
        tr.id = `row${idCount}`
        for (var i=0; i<6; i++) {
            var td = document.createElement("td");
                var input = document.createElement("input");
                input.className = "number";
                input.value = csvLine[i];
                switch(i) {
                    case 0:
                        input.id = `x${idCount}`;
                        break;
                    case 1:
                        input.id = `y${idCount}`;
                        break;
                    case 2:
                        input.id = `angle${idCount}`;
                        break;
                    case 3:
                        input.id = `epsilon${idCount}`;
                        break;
                    case 4:
                        input.id = `speed${idCount}`;
                        break;
                    case 5:
                        input.id = `accel${idCount}`;
                        break;
                }
                td.appendChild(input);
            tr.appendChild(td);
        }
    document.getElementById("pointTable").appendChild(tr);
    idCount++;
}

// downloads the java file
function download() {
    var link = document.createElement("a");
    link.download = document.getElementById("pathNameInput").value + ".java";
    var blob = new Blob([document.getElementById("codeblock").innerText], {type : "text/csv"});
    link.href = URL.createObjectURL(blob);
    
    var e = document.createEvent("MouseEvents");
    e.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    link.dispatchEvent(e);
}