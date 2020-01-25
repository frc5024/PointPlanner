document.getElementById("fileUpload").onchange = function () {
    if (document.getElementById("fileUpload").files[0] !== undefined) {
        var link = URL.createObjectURL(document.getElementById("fileUpload").files[0]);
        fetch(link).then((response) => response.text().then((data) => { parseData(data); }));
    }
}
function parseData(txt) {
    document.getElementById("points").innerHTML = `<h2 class="title">Points</h2>
    <table id="pointTable">
        <tr>    
            <th>X</th>
            <th>Y</th>
            <th>θ</th>
            <th>ε</th>
            <th>speed</th>
            <th>accel</th>
        </tr>
    </table>`;
    

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