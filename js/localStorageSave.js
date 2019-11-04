// saves field selection and all points to local storage
function save() {
    var saveObj = {};
    saveObj.field = selectedField;
    var p = [];
    for (var i=0,l=points.length; i<l; i++) {
        p.push([points[i].x,points[i].y,points[i].angle]);
    }
    saveObj.points = p;
    localStorage.pointPlannerSave = JSON.stringify(saveObj);
}

// loads field selection and all points from local storage
function loadSave() {
    if (localStorage.pointPlannerSave !== undefined) {
        var s = JSON.parse(localStorage.pointPlannerSave);
        if (s.field !== undefined) {
            document.getElementById("fieldSelection").value = s.field;
            document.getElementById(`option${s.field}`).selected = true;
            selectedField = s.field;
        }
        if (s.points !== undefined) {
            for(var i=0, l=s.points.length; i<l; i++) {
                points.push(new point(s.points[i][0],s.points[i][1],s.points[i][2]));
            }
        }
    }
}