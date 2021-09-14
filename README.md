# Overview of Algorithm / Approach

'Luna': 62, 
'Mars': 676, 
'Jupiter': 611

So, to begin, if 'position' is undefined, then it starts the mining process by simply going down one move horizontally (to the bottom right, position.y + 1).

When the 'position' is defined, then all of the coordinates are defined as constants.

Since I wasn't able to access the position properties directly, I pulled the coordinates from new Position objects and then used several methods to get arrays which would hold the coordinates. From there, values are extracted from the mine arrays directly, including the future states, which includes nine possibilities (three subsets of three). These values are to be used for checking the number of zeroes that exist two steps into the future, and with respect to valid moves from each of the following positions.

The filter() method is used to get the number of zeroes from each of these arrays, which is then used in the *incomplete* algorithm for zero-checking.

At the top of the mine, if the topRight value is undefined, then it will select between straightRight and bottomRight coordinates.

Next, several conditional statements are used to determine the highest values, including sorting based on where elements are equal.

New Position objects are initialized again to be used in getting values from the mine array. These values are then used in an algorithm that follows, which is to sort each of the relevant sets (positions, moves, or values) such that invalid 'repeat' moves are always the third best (i.e. 'worst') options.

An incomplete algorithm that utilises the the future states of the zero sets has been implemented, but it does not function as intended.

Finally, it does a simple check for whether the currentPosition is equal to previousPosition.

The 'bestGoldMove' (a coordinate) and 'previousPosition' (the current position) values are determined by the preceding steps. As long as the spanning of the mine is not out of bounds, it creates a new position at the end of each call.

# Comments

None of the functionality of other files (validator.js, position.js, runner.js) has been modified, except for trivial changes (e.g. comments for checking).

No testing has been implemented, as I am not all that familiar with it.

I was only executing the maps individually (i.e. npm start luna, npm start mars, npm start jupiter), as it does not complete when running all of the maps at once.

Again, I was not able to get the zero-checking algorithm working. It seems to be the crux of being able to effectively span the 'jupiter' set. I did have moments of what seemed like success, but after many attempts at an implementation, I'm at a loss.
