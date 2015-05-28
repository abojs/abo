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
