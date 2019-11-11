# Thought Process

* To start with, write a "greedy" algorithm that does a look-ahead at 1-3 available moves; the miner should take the best option
* Make everything simpler with helper functions

Some thoughts / challenges while finishing up:
* Taking the first possible movement when I hit the end can lead to the miner being off the "board", which is resulting in crash errors (why does this not happen with the "default" miner?)
* By adding ``return new Position(position.x+1, position.y+1);`` as my "leaving" move, I am opened to the possibility of that move being invalid... This might be something to discuss with Jordan.
* Looks like Kierstan implemented the same algorithm as me, haha
* Maybe I should have reused the existing direction "enum" from the validator.js for consistency. 