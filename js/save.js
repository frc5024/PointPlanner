function save() {
    var saveObj = {};
    saveObj.field = selectedField;
    saveObj.points = points;
    localStorage.pointPlannerSave = JSON.stringify(saveObj);
}

function loadSave() {
    if(localStorage.pointPlannerSave !== undefined) {
        var s = JSON.parse(localStorage.pointPlannerSave);
        if(s.field !== undefined) {
            document.getElementById("fieldSelection").value = s.field;
        }
        if(s.points !== undefined) {
            for(var i=0, l=s.points.length; i<l; i++) {
                points.push(new point(s.points[i].x,s.points[i].y));
            }
        }
    }
}