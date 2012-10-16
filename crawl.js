/**
 * Uses google to try to find EAD XML documents out on the World Wild Web.
 */

var fs = require("fs"),
    url = require("url"),
    async = require("async"),
    http = require("http"),
    google = require("google"),
    request = require("request"),
    libxmljs = require("libxmljs"),
    redisdump = require("redis-dump"),
    redis = require("redis").createClient();

// go easy on ead websites
http.globalAgent.maxSockets = 2;

function main() {
  async.series([crawl, exit]);
}

/**
 * Crawl google and return a dictionary of hostnames and sample
 * ead files.
 */

function crawl(opts) {
  if (! opts) opts = {};
  var sleepMillis = opts.sleep || 5000;
  var maxPages = opts.maxPages || -1;
  var nextCounter = 0;
  google.resultsPerPage = 25;
  
  google("ead filetype:xml", function(err, next, links) {
    if (err) {
      console.log("unable to fetch google search results: " + err); 
      return;
    }
  
    // add hits to redis if they are EAD XML docs
    for (var i = 0; i < links.length; ++i) {
      isEAD(links[i].link, function(u) {
        redis.sadd(url.parse(u).host, u);
      });
    }

    // process next page
    if (nextCounter < maxPages || maxPages == -1) {
      sleep(sleepMillis);
      nextCounter += 1;
      if (next) { 
        console.log("\nfetching page " + nextCounter);
        next();
      } else {
        redis.quit();
      }
    }

  });

}

function exit() {
  redis.quit();
}

function isEAD(url, callback) {
  request(url, function(err, response, body) {
    if (err) {
      console.log("can't fetch " + url);
      return;
    }

    try {
      var doc = libxmljs.parseXml(body);
      if (doc.root().name() == "ead") {
        console.log("found ead xml: " + url);
        callback(url);
      }
    } catch(e) {
      console.log(url + " is not xml");
    }
  });
}

function sleep(milliSeconds) {
  var startTime = new Date().getTime();
  while (new Date().getTime() < startTime + milliSeconds);
}

main();
