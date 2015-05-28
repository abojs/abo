'use strict';

var cookie = require('./cookie');
var selectExpt = require('./select-expt');
var vkey = 'abo.x';

function assigneExpt(expts) {
  if (!expts) {
    return null;
  }

  var cookieExptId = cookie.get(vkey);
  if (cookieExptId) {
    if (expts[cookieExptId]) {
      return expts[cookieExptId];
    }
    cookie.remove(vkey);
  }

  var exptArray = [];
  for (var i in expts) {
    exptArray.push(expts[i]);
  }

  var assignedExpt = selectExpt(exptArray);

  if (assignedExpt) {
    cookie.set(vkey, assignedExpt.id);
    return assignedExpt;
  }
  return null;
}

module.exports = assigneExpt;
