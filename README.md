# abo

``` js
var abo = new Abo();
abo.addExpt({
  id: '423',
  name: 'Blue buttons on Homepage',
  /* Assignment Condition */
  ac: function() {
    return location.href.indexOf('/homepage/') !== -1;
  },
  traffic: 0.1, // 10% of the traffic will be assigned to this variation if the Assignemt condition was satisfied
  setup: function() {
    // make the buttons blue here
  }
});

abo.start();
```