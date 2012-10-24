var url = require("url"),
    cheerio = require("cheerio"),
    RateLimiter = require("limiter").RateLimiter,
    request = require("request"),
    libxmljs = require("libxmljs"),
    redis = require("redis").createClient();

// limit outbound requests to 30 per minute
var limiter = new RateLimiter(30, 'minute');

/**
 * Add a finding aid URL, by looking to see if there is a EAD 
 * XML document there or not.
 */

function addUrl(u1) {
  isEAD(u1, function(is, u2) {
    var host = url.parse(u2).host;
    console.log(u2);
    if (is) {
      redis.sadd(host + "__xml", u2);
    } else {
      redis.sadd(host + "__html", u2);
    }
  });
}

/**
 * Tests if a URL is for an EAD document.
 */

function isEAD(url, callback) {
  get(url, function(response, body) {
    // url might've redirected
    u = response.request.uri.href;

    try {
      var doc = libxmljs.parseXml(body);
      if (doc.root().name() == "ead") {
        callback(true, u);
      } else {
        callback(false, u);
      }
    } catch(e) {
      // oh well it isn't ead xml
    }
  });
}

function getDoc(url, callback) {
  get(url, function(response, html) {
    callback(cheerio.load(html));
  });
}

function get(url, callback) {
  limiter.removeTokens(1, function(err, remainingRequests) {
    request(url, function(e, response, content) {
      if (e) {
        console.log("error when fetching " + url + " : " + e);
      } else {
        callback(response, content);
      }
    });
  });
}

function finish() {
  redis.quit();
}

exports.get = get;
exports.getDoc = getDoc;
exports.addUrl = addUrl;
exports.finish = finish;
