var path = require('path');

// JSON 표기법(JavaScript Object Notation)
var mime = {
  "html": "text/html",
  "css": "text/css",
  "js": "application/javascript",
  "svg": "image/svg+xml",
  // ......
};

function getMime(url){
  // today.html -> "text/html"
  // layout.css -> "text/css"
  var extname = path.extname(url).substring(1);
  return mime[extname];
}

module.exports = {
  getMime: getMime
};