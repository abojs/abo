(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var cookie = require('easy-cookie');
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

},{"./select-expt":3,"easy-cookie":4}],2:[function(require,module,exports){
'use strict';

var assignExpt = require('./assign-expt');

function abo(expts) {
  expts = expts || [];

  var assignedExpt = assignExpt(expts);

  if (assignedExpt && assignedExpt.setup) {
    assignedExpt.setup();
  }
}

module.exports = window.abo = abo;

},{"./assign-expt":1}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
'use strict';

var trueDomain = require('true-domain');

var cookie = {
  /** Removes a cookie by name.
   * @param {string} key - The key to be removed.
   */
  remove: function(key) {
    this.set(key, '', -1);
  },

  /** Sets the value of a cookie.
   * @param {string} key - The key of the cookie.
   * @param {string} value - The value of the cookie.
   * @param {number} [expires] - The lifetime of the cookie in days.
   */
  set: function(key, value, expires) {
    var lifetimeDays = expires ? expires : 7;
    expires = new Date();
    expires.setTime(+expires + lifetimeDays * 864e+5);

    document.cookie = [
      encodeURIComponent(key), '=', encodeURIComponent(String(value)),
      // use expires attribute, max-age is not supported by IE
      '; expires=', expires.toUTCString(),
      '; path=/',
      trueDomain === 'localhost' ? '' : '; domain=' + trueDomain
    ].join('');
  },

  /** Returns the value of a cookie under the specified key.
   * @param {string} key - The key to return the value of.
   * @returns {string} - The value of the cookie.
   */
  get: function(key) {
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
  }
};

module.exports = cookie;

},{"true-domain":5}],5:[function(require,module,exports){
'use strict';

module.exports = (function(d) {
  var trueDomain, p;
  var domain = d.domain;
  var s = '_gd' + Math.random();

  function getTrueDomain(parts, domain) {
    domain = parts.pop() + (!domain ? '' : '.' + domain);
    d.cookie = s + '=' + s + ';domain=' + domain + ';';
    if (!parts.length || d.cookie.indexOf(s + '=' + s) !== -1) {
      return domain;
    }
    return getTrueDomain(parts, domain);
  }

  p = domain.split('.');
  trueDomain = getTrueDomain(p);

  d.cookie = s + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=' +
    trueDomain + ';';
  return trueDomain;
})(document);

},{}]},{},[2]);
