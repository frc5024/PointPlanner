var fieldImages = [];
var fieldJSONs = [];
for(var i=0;i<links.length;i++) {fieldJSONs.push(null);}

var selectedField = 0;

var fCvs = document.getElementById("fieldImageCanvas");
var fCtx = fCvs.getContext("2d");

var pCvs = document.getElementById("pointCanvas");
var pCtx = fCvs.getContext("2d");

function updateLoop() {
    resize();

    selectedField = parseInt(document.getElementById("fieldSelection").value);

    drawField(selectedField);
}

document.getElementById("fieldSelection").onchange = function() {
    selectedField = parseInt(document.getElementById("fieldSelection").value);
    save();
}

for(var i=0; i<links.length; i++) {
    loadField(i);
}

setInterval(updateLoop,20);