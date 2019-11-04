// called once for each field when the page loads. Load a field
function loadField(linksIndex) {
    // links for desired field
    var field = links[linksIndex];

    // create a XMLHttpRequest for the JSON data
    getJSON(field.jsonURL,  function(err, data, index) {
        if (err != null) {
            console.error(err);
        } else {
            fieldJSONs.splice(index, 1, data); // put JSON in fieldJSONs array
            addImage(field.imageURL, index); // puts a new image with the url links[linksIndex].imageURL into the fieldImages array
            generateOption(index); // adds this field as an option in the dropdown

            if (fieldImages.length === links.length) { // when everything is load, attempt to load a save from local storage
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

// adds options to field dropdown
function generateOption(index) {
    var o = document.createElement("option");
    o.class = "dropDown";
    o.value = index;
    o.id = `option${index}`;
    o.innerHTML = fieldJSONs[index].game;
    if (index===0) {
        o.selected = true;
    }

    document.getElementById("fieldSelection").appendChild(o);
}