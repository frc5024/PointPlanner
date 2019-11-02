// taken from http://zetcode.com/articles/javascriptjsonurl/
var getJSON = function(url, callback, index) {

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    
    xhr.onload = function() {
    
        var status = xhr.status;
        
        if (status == 200) {
            callback(null, xhr.response, index);
        } else {
            callback(status);
        }
    };
    
    xhr.send();
};