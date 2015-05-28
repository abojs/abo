# abo

Abo is a micro front-end A/B testing library.

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