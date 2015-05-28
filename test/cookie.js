'use strict';

var cookie = require('../lib/cookie');

describe('Cookie', function() {
  it('sets, gets and removes string', function() {
    var value = 'bar';
    var key = 'foo';

    cookie.set(key, value);
    expect(cookie.get(key)).toBe(value);

    cookie.remove(key);
    expect(cookie.get(key)).toBeNull();
  });
});
