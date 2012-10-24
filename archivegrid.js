var http = require("http"),
    resolve = require("url").resolve,
    utils = require("./utils.js");

var baseUrl = "http://beta.worldcat.org/archivegrid/";

function main() {
  getFindingAids(function(url) {
    utils.addUrl(url);
  });
}

function getFindingAids(callback) {
  utils.getDoc(baseUrl, function($) {
    $('a[title="Search for this topic"]').each(function(i) {
      getResults(resolve(baseUrl, this.attr("href")), callback);
    });
  });
}

function getResults(url, callback) {
  console.log("looking at " + url);
  utils.getDoc(url, function($) {
    $('a[class="findingaidlink"]').each(function() {
      callback(this.attr("href"));
    });
    var next = $('a[title="Next"]')[0];
    if (next) {
      getResults(resolve(baseUrl, $(next).attr("href")), callback);
    }
  });
}

main();
