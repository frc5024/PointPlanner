function resize() {
    var f = document.getElementById("field");
    var w = f.clientWidth;
    var h = f.clientHeight;
    var x = f.offsetLeft;
    var y = f.offsetTop;
    
    fCvs.width = w;
    fCvs.height = h;
    fCvs.offsetLeft = x;
    fCvs.offsetTop = y;

    pCvs.width = w;
    pCvs.height = h;
    pCvs.offsetLeft = x;
    pCvs.offsetTop = y;

    if(fieldJSONs[selectedField] !== null) {
        var fc = fieldJSONs[selectedField]["field-corners"];
        var tl = fc["top-left"];
        var br = fc["bottom-right"];
        ratio = {
            x: (fCvs.width/ (br[0]-tl[0]) ),
            y: ( fCvs.height /(br[1]-tl[1])  )
        }
    }
}