'use strict';

var cookie = require('./cookie');

function Abo() {
  this._expts = {};
}

Abo.prototype.addExpt = function(expt) {
  this._expts[expt.id] = expt;
};

Abo.prototype.start = function() {
  var cookieExptId = cookie.get('abo.x');

  if (!cookieExptId || !this._expts[cookieExptId]) {
    //get some expt
  }


};

module.exports = Abo;
