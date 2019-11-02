function save() {
    var saveObj = {};
    saveObj.field = selectedField;
    localStorage.pointPlannerSave = JSON.stringify(saveObj);
}

function loadSave() {
    if(localStorage.pointPlannerSave !== undefined) {
        var s = JSON.parse(localStorage.pointPlannerSave);
        document.getElementById("fieldSelection").value = s.field;
    }
}