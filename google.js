/**
 * Uses google to try to find EAD XML documents out on the World Wild Web.
 */

var fs = require("fs"),
    url = require("url"),
    async = require("async"),
    google = require("google"),
    utils = require("./utils.js"),
    redis = require("redis").createClient();

function main() {
  async.series([crawl, exit]);
}

/**
 * Crawl google and return a dictionary of hostnames and sample
 * ead files.
 */

function crawl(opts) {
  if (! opts) opts = {};
  var maxPages = opts.maxPages || -1;
  var nextCounter = 0;
  google.resultsPerPage = 25;
  
  google("ead filetype:xml", function(err, next, links) {
    if (err) {
      console.log("unable to fetch google search results: " + err); 
    }
  
    // add hits to redis if they are EAD XML docs
    for (var i = 0; i < links.length; ++i) {
      utils.addUrl(links[i].link);
    }

    // process next page
    if (nextCounter < maxPages || maxPages == -1) {
      nextCounter += 1;
      if (next) { 
        console.log("\nfetching page " + nextCounter);
        next();
      } else {
        redis.quit();
      }
    } else {
      console.log("ending now!");
    }

  });

}

function exit() {
  redis.quit();
}

main();
