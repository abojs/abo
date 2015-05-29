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
