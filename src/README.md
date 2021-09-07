# General Approach

Upon examining the problem, it was clear that a greedy/brute-force approach would result in far too lengthy of a run time.
It was hence necessary to shake off the dynamic programming cobwebs and make use of this strategy to find a solution.

Based on the constraints imposed, there are always at least two, and potentially three **legal** movement options at each cell
(apart from those in the the final column). For example, in the following mine:

```
 1  1  9
 4  9  5
 6  0  1
```

the central cell (second row, second column) has three potential movement options:
- **diagonally up** to reach cell with `9`
- **right** to reach cell with `5`
- **diagonally down** to reach cell with `1`

Looking solely at this cell, the best path to take is diagonally up, since it results in the greatest total gold. This is the basis for our strategy here,
which involves backtracking to the mine to build up information on the best available paths.

The general approach is as follows:
- beginning with the last column in the mine, iterate backwards through the columns (and backwards up each row in said column).
- for each node:
  -  store information on the **best** possible path and the **second best** possible path. (those in the last column will be the base case)
- when we reach the first column, simply take the node with the best possible path (greatest potential value achievable) and follow this path to maximize gold.

The reason for keeping track of the alternate path is to prevent "losing" a potential best path in an earlier column. For example,
consider the mine from above:

```
 1  1  9
 4  9  5
 6  0  1
```

As mentioned, the best path for the central cell is **diagonally up** to `9` and the second best path is **right** to `5`.
Moving on to the first column, when applying this algorithm for the southwest cell (third row, first column), we can clearly see that, of the two available options
(**diagonally up** to `9` and **right** to `0`), moving **diagonally up** is the only path that makes sense, since the other would end our mining expedition.

Unfortunately, the next best path after this is also a movement **diagonally up** (from `9` to `9`), so we cannot take this "happiest path". Instead, we simply 
take the central cell's alternate path (**right** to `5`), resulting in an end path of `6` -> `9` -> `5` which, as can be seen, yields the most gold in this
mine (20).
