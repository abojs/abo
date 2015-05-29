'use strict';

var cookie = require('./cookie');
var selectExpt = require('./select-expt');
var vkey = 'abo.x';

function getExptIdFromUrl(url) {
  var matches = url.match(/abo.x\[[^\]]+\]/);
  if (matches && matches.length) {
    var match = matches[0];
    return match.substr(5, match.length - 1);
  }
  return null;
}

function assignExpt(exptArray, location) {
  location = location || window.location;

  if (!exptArray) {
    return null;
  }

  var expts = {};
  exptArray.forEach(function(expt) {
    expts[expt.id] = expt;
  });

  var forcedExptId = getExptIdFromUrl(location.href);
  if (forcedExptId && expts[forcedExptId]) {
    cookie.set(vkey, forcedExptId);
    return expts[forcedExptId];
  }

  var cookieExptId = cookie.get(vkey);
  if (cookieExptId) {
    if (expts[cookieExptId]) {
      return expts[cookieExptId];
    }
    cookie.remove(vkey);
  }

  var assignedExpt = selectExpt(exptArray);

  if (assignedExpt) {
    cookie.set(vkey, assignedExpt.id);
    return assignedExpt;
  }
  return null;
}

module.exports = assignExpt;
