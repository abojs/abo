(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var assignExpt = require('./assign-expt');

function abo(expts) {
  expts = expts || [];

  var assignedExpt = assignExpt(expts);

  if (assignedExpt && assignedExpt.setup) {
    assignedExpt.setup();
  }
}

module.exports = abo;

},{"./assign-expt":2}],2:[function(require,module,exports){
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

},{"./cookie":4,"./select-expt":5}],3:[function(require,module,exports){
'use strict';

/* Source of the domain retriever http://bit.ly/1yvoNw2 */
function baseDomain() {
  var i = 0;
  var domain = document.domain;
  var p = domain.split('.');
  var s = '_gd' + (new Date()).getTime();
  while (i < (p.length - 1) && document.cookie.indexOf(s + '=' + s) === -1) {
    domain = p.slice(-1 - (++i)).join('.');
    document.cookie = s + '=' + s + ';domain=' + domain + ';';
  }
  document.cookie = s + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=' +
    domain + ';';
  return domain;
}

module.exports = baseDomain;

},{}],4:[function(require,module,exports){
'use strict';

var baseDomain = require('./base-domain')();

/** Sets the value of a cookie.
 * @param {string} value - The value of the cookie.
 * @param {number} [expires] - The lifetime of the cookie in days.
 */
exports.set = function(key, value, expires) {
  var lifetimeDays = expires ? expires : 7;
  expires = new Date();
  expires.setTime(+expires + lifetimeDays * 864e+5);

  document.cookie = [
    encodeURIComponent(key), '=', encodeURIComponent(String(value)),
    // use expires attribute, max-age is not supported by IE
    '; expires=', expires.toUTCString(),
    '; path=/',
    baseDomain === 'localhost' ? '' : '; domain=' + baseDomain
  ].join('');
};

/** Removes a cookie by name.
 */
exports.remove = function(key) {
  exports.set(key, '', -1);
};

/** Returns the value of a cookie under the specified key.
 * @returns {string} - The value of the cookie.
 */
exports.get = function(key) {
  if (!key) {
    return null;
  }

  var cookies = document.cookie ? document.cookie.split('; ') : [];

  for (var i = cookies.length; i--;) {
    var parts = cookies[i].split('=');
    var name = decodeURIComponent(parts.shift());
    var cookie = parts.join('=');

    if (key && key === name) {
      return decodeURIComponent(cookie);
    }
  }

  return null;
};

},{"./base-domain":3}],5:[function(require,module,exports){
'use strict';

function selectExpt(expts) {
  expts = expts.filter(function(expt) {
    var acType = typeof expt.ac;
    return acType === 'undefined' ||
      acType === 'function' && expt.ac() || acType !== 'function' && expt.ac;
  });

  if (!expts.length) {
    return null;
  }
  if (expts.length === 1) {
    return expts[0];
  }

  var allocatedTraffic = 0;
  var exptWoAllocation = [];
  expts.forEach(function(expt) {
    if (typeof expt.traffic === 'number') {
      allocatedTraffic += expt.traffic;
    } else {
      exptWoAllocation.push(expt);
    }
  });

  if (exptWoAllocation.length) {
    var avgRest = allocatedTraffic >= 1 ?
      0 : (1 - allocatedTraffic) / exptWoAllocation.length;

    exptWoAllocation.forEach(function(expt) {
      expt.traffic = avgRest;
    });
  }

  var epsilon = Math.random();
  var cursor = 0;
  for (var i in expts) {
    var expt = expts[i];
    if (!expt.traffic) {
      continue;
    }
    var next = cursor + expt.traffic;
    if (epsilon >= cursor && epsilon < next || expt.traffic === 1) {
      return expt;
    }
    cursor = next;
  }
  return null;
}

module.exports = selectExpt;

},{}]},{},[1]);
