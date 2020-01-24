// saves field selection and all points to local storage
function save() {
    var saveObj = {};
    saveObj.field = selectedField;
    var p = [];
    for (var i=0,l=points.length; i<l; i++) {
        p.push([points[i].x,points[i].y,points[i].angle,(points[i].type==="origin"?1:0)]);
    }
    saveObj.points = p;
    localStorage.pointPlannerSave = JSON.stringify(saveObj);
}

// loads field selection and all points from local storage
function loadSave() {
    if (localStorage.pointPlannerSave !== undefined) {
        var s = JSON.parse(localStorage.pointPlannerSave);

        document.getElementById("fieldSelection").value = s.field;
        document.getElementById(`option${s.field}`).selected = true;
        selectedField = s.field;
        
        var isOrigin = false;
        for(var i=0;i<s.points.length;i++) {
            if(s.points[i][3]) {
                isOrigin = true;
            }
        }

        if(!isOrigin) {
            addOrigin();
        }
        for(var i=0, l=s.points.length; i<l; i++) {
            points.push(new point(s.points[i][0],s.points[i][1],s.points[i][2],(s.points[i][3]?"origin":"point")));
            if(s.points[i][3]) {
                var p = points[points.length-1];
                origin = {x:p.meterX,y:p.meterY,angle:p.angle};
            }
        }
    } else {
        addOrigin();
    }
}

function addOrigin() {
    var fc = fieldJSONs[selectedField]["field-corners"];
    var tl = fc["top-left"];
    var br = fc["bottom-right"];
    points.splice(0,0,new point(0, (br[1]-tl[1])/2, 0, "origin"));
}