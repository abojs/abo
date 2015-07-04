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
