'use strict';

var _ = require('lodash');
var selectExpt = require('../lib/select-expt');

function testAllocation(expts, repeatCount) {
  var hits = {};

  for (var i = 0; i < repeatCount; i++) {
    var expt = selectExpt(expts);
    if (!expt) {
      continue;
    }
    hits[expt.id] = (hits[expt.id] || 0) + 1;
  }

  return hits;
}

describe('selectExpt', function() {
  it('Selects the only experiment', function() {
    var expt = selectExpt([{
      id: '1',
      name: 'Foo'
    }]);
    expect(expt.id).toBe('1');
  });

  it('Doesn`t select the only experiment if assignment condition is not satisfied', function() {
    var expt = selectExpt([{
      id: '1',
      name: 'Foo',
      ac: _.constant(false)
    }]);
    expect(expt).toBe(null);
  });

  it('Selects the only experiment with satisfied assignment condition', function() {
    var expt = selectExpt([{
      id: '1',
      name: 'Foo',
      ac: _.constant(false)
    }, {
      id: '2',
      name: 'Bar',
      ac: _.constant(true)
    }, {
      id: '3',
      name: 'Qaz',
      ac: _.constant(false)
    }]);
    expect(expt.id).toBe('2');
  });

  it('Always selects the experiment with 100% traffic allocation', function() {
    var hits = testAllocation([{
      id: '1',
      name: 'Foo'
    }, {
      id: '2',
      name: 'Bar',
      traffic: 1
    }], 10);

    expect(hits['1'] || 0).toBe(0);
    expect(hits['2']).toBe(10);
  });

  it('divides the traffic 10:10:80 between three experiments', function () {
    var hits = testAllocation([{
      id: '1',
      name: 'Foo',
      traffic: 0.1
    }, {
      id: '2',
      name: 'Bar',
      traffic: 0.1
    }, {
      id: '3',
      name: 'Qar',
      traffic: 0.8
    }], 500);

    expect(Math.round(hits[1] / 50)).toBeCloseTo(1);
    expect(Math.round(hits[2] / 50)).toBeCloseTo(1);
    expect(Math.round(hits[3] / 50)).toBeCloseTo(8);
  });

  it('divides the traffic equally between experiments without specified allocation', function () {
    var hits = testAllocation([{
      id: '1',
      name: 'Foo'
    }, {
      id: '2',
      name: 'Bar'
    }, {
      id: '3',
      name: 'Qar',
      traffic: 0.8
    }], 500);

    expect(Math.round(hits[1] / 50)).toBeCloseTo(1);
    expect(Math.round(hits[2] / 50)).toBeCloseTo(1);
    expect(Math.round(hits[3] / 50)).toBeCloseTo(8);
  });

  it('divides the traffic equally between two experiments with no traffic allocation specified', function () {
    var hits = testAllocation([{
      id: '1',
      name: 'Foo'
    }, {
      id: '2',
      name: 'Bar'
    }], 1000);

    expect(Math.round(hits[1] / 100)).toBeCloseTo(5);
    expect(Math.round(hits[2] / 100)).toBeCloseTo(5);
  });
});
