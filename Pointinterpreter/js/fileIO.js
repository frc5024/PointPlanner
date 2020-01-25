document.getElementById("fileUpload").onchange = function () {
    if (document.getElementById("fileUpload").files[0] !== undefined) {
        var link = URL.createObjectURL(document.getElementById("fileUpload").files[0]);
        fetch(link).then((response) => response.text().then((data) => { parseData(data); }));
    }
}
function parseData(txt) {
    var lines = txt.split("\n");
    for(var i=1;i<lines.length-1;i++) {
        var line = lines[i].split(",");
        line.push(5);
        line.push(0);
        addTableRow(line);
    }
}

var idCount = 0;

function addTableRow(csvLine) {
    var tr = document.createElement("tr");
        tr.id = `row${idCount}`
        for (var i=0; i<5; i++) {
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
                }
                td.appendChild(input);
            tr.appendChild(td);
        }
    document.getElementById("pointTable").appendChild(tr);
}