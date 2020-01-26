var ratio = {x:1,y:1}; // multiplier for coordinates based on how stretched the image is

var fieldImages = []; // stores loaded field pictures
var fieldJSONs = []; // stores loaded json data
for(var i=0;i<links.length;i++) {fieldJSONs.push(null);} // fill array with null to prevent errors

var selectedField = 0; // index of selected field
var FieldHeight; // height of field in meters

// loads in json and image for all fields
for(var i=0; i<links.length; i++) {
    loadField(i);
}

function loadField(linksIndex) {
    // links for desired field
    var field = links[linksIndex];

    fetch(field.jsonURL).then((response) => response.text().then((data) => { fieldJSONs.splice(linksIndex, 1, JSON.parse(data));addImage(field.imageURL, linksIndex); generateOption(linksIndex);}));

    // // create a XMLHttpRequest for the JSON data
    // getJSON(field.jsonURL,  function(err, data, index) {
    //     if (err != null) {
    //         console.error(err);
    //     } else {
    //         fieldJSONs.splice(index, 1, data); // put JSON in fieldJSONs array
    //         addImage(field.imageURL, index); // puts a new image with the url links[linksIndex].imageURL into the fieldImages array
    //         generateOption(index); // adds this field as an option in the dropdown

    //         if (fieldImages.length === links.length) { // when everything is load, attempt to load a save from local storage
    //             loadSave();
    //         }
    //     }
    // }, linksIndex);
}
function addImage(url, index) {
    var tempImg = new Image();
    tempImg.src = url;
    fieldImages.splice(index, 0, tempImg);
}
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