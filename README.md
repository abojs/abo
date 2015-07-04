# abo

Abo is a micro front-end A/B testing library.

[![Dependency Status](https://david-dm.org/abojs/abo/status.svg?style=flat)](https://david-dm.org/abojs/abo)
[![Build Status](https://travis-ci.org/abojs/abo.svg)](https://travis-ci.org/abojs/abo)
[![npm version](https://badge.fury.io/js/abo.svg)](http://badge.fury.io/js/abo)

![](https://i.imgur.com/I86ILqQ.jpg)

## Installation

```
npm install --save abo
```

## How it works?

The first time a user visits a page he gets an experiment assigned. The experiment's ID is stored in the user's cookies. He will not get other experiments assigned until the one he's on is active.

**How is the traffic allocated between experiments?**
By default, the traffic is divided equally between all experiments. If some experiment has to have more or less traffic, it can be specified through the **traffic** parameter. The value of traffic has to be between 0 and 1. 0 is no traffic at all. 1 is 100% of the traffic.

**How to target specific devices/pages/users with an experiment?**
An experiment will only be assigned to a user if its assignment condition is satisfied. The assignment condition is a function passed to the **ac** property that returns a boolean. So if an experiment is changing the homepage for mobile devices, the AC of the experiment can look like this:

``` js
function() {
  return location.href.indexOf('/homepage/') !== -1 &&
    matchMedia('(max-width: 749px)').matches;
}
```

## Usage example

``` js
abo([{
  id: '423',
  name: 'Blue buttons on Homepage',
  /* Assignment Condition */
  ac: function() {
    return location.href.indexOf('/homepage/') !== -1;
  },
  traffic: 0.1, // 10% of the traffic will be assigned to this variation if the Assignemt condition was satisfied
  setup: function() {
    $('button').css({
      'background-color': 'blue'
    });
  }
}, {
  id: '132',
  name: 'New page title',
  setup: function() {
    $('title').html('New page title');
  }
}]);
```


## Project generation
Don't know how to bootstrap your A/B testing project with Abo? No problems, just use [Yeoman generator for Abo](https://github.com/abojs/generator-abo).


## License

The MIT License (MIT)
