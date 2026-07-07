(function () {
  'use strict';
  var grid = document.getElementById('ghInsProjGrid');
  if (!grid) return;
  var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-gh-proj-card]'));
  if (cards.length < 2) return;
  for (var i = cards.length - 1; i > 0; i -= 1) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = cards[i];
    cards[i] = cards[j];
    cards[j] = tmp;
  }
  cards.forEach(function (card) {
    grid.appendChild(card);
  });
})();
