'use strict';

var assignExpt = require('./assign-expt');

function Abo() {
  this._expts = {};
}

Abo.prototype.addExpt = function(expt) {
  this._expts[expt.id] = expt;
};

Abo.prototype.start = function() {
  this.assignedExpt = assignExpt(this._expts);

  if (this.assignedExpt && this.assignedExpt.setup) {
    this.assignedExpt.setup();
  }
};

module.exports = Abo;
