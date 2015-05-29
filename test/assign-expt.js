'use strict';

var assignExpt = require('../lib/assign-expt');
var cookie = require('../lib/cookie');
var _ = require('lodash');
var vkey = 'abo.x';

describe('Assign experiment', function() {
  it('from cookie', function() {
    cookie.set(vkey, '1');
    var expt = assignExpt([{
      id: '1',
      name: 'Foo'
    }]);
    expect(expt.id).toBe('1');
  });

  it('remove from cookie if experiment doesn`t exist and no new assignable experiments', function() {
    cookie.set(vkey, '2');
    var expt = assignExpt([{
      id: '1',
      name: 'Foo',
      ac: _.constant(false)
    }]);
    expect(expt).toBe(null);
    expect(cookie.get(vkey)).toBe(null);
  });

  it('add new experiment to the cookie', function() {
    cookie.remove(vkey);
    var expt = assignExpt([{
      id: '1',
      name: 'Foo'
    }]);
    expect(expt.id).toBe('1');
    expect(cookie.get(vkey)).toBe('1');
  });

  it('forces existing experiment and adds it to the cookie', function() {
    cookie.remove(vkey);
    var expt = assignExpt([{
      id: '1',
      name: 'Foo'
    }], {href:'http://domain.com?abo.x=[1]'});
    expect(expt.id).toBe('1');
    expect(cookie.get(vkey)).toBe('1');
  });
});
