// called once for each field when the page loads. Load a field
function loadField(linksIndex) {
    var field = links[linksIndex];

    getJSON(field.jsonURL,  function(err, data, index) {
    
        if (err != null) {
            console.error(err);
        } else {
            fieldJSONs.splice(index, 1, data);
            addImage(field.pngURL, index);
            generateOption(index);

            if(fieldImages.length === links.length) {
                loadSave();
            }
        }
    }, linksIndex);
}

// start loading image and put in fieldImages array
function addImage(url, index) {
    var tempImg = new Image();
    tempImg.src = url;
    fieldImages.splice(index, 0, tempImg);
}

// adds options to field drop down
function generateOption(index) {
    var o = document.createElement("option");
    o.class = "dropDown";
    o.value = index;
    o.innerHTML = fieldJSONs[index].game;

    document.getElementById("fieldSelection").appendChild(o);
}