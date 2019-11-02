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
}