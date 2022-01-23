---
title: "Book Game"
permalink: /projects/book-trivia-game
date: 2022-01-15T11:48:41-04:00
---

<style>
#word-game { font-size: 16px; }

</style>

<div id="word-game"></div>

<script type="text/javascript" src="{{ site.baseurl }}/assets/book_game/bookGame.js"></script>
<script type="text/javascript">
document.addEventListener("DOMContentLoaded", function(event) { 
bookGame.buildGame('{{ site.baseurl }}/assets/book_game', 'word-game', '{{ site.baseurl }}/projects/book-trivia-game-about');
});

</script>