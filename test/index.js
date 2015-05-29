'use strict';

var proxyquire = require('proxyquireify')(require);
var stubs = {
  './assign-expt': function(expts) {
    return expts[0];
  }
};

var abo = proxyquire('../lib', stubs);

describe('abo', function() {
  it('Executes setup function of the assigned experiment', function(done) {
    abo([{
      id: '1',
      setup: function() {
        done();
      }
    }]);
  });
});
