# Intial Thoughts

***See Below inital thoughts for implementation***

After reading the problem my first thought is that this should be solved recursively or with DP. A simple brute force approach would be to always take the local maximum and backtrack on zeros, but the problem with this is that while the next number route may be the highest it could miss a even higher value resulting in a larger end value.

My next though is to just run through the whole graph using a modified DFS algorithm the problem with this is that you technical have 'm' graphs of 'n' length running through all of them is exponential time and is not ideal.

Looking at the problem further we can try the approach of breaking it down into small problem set. If you think of the total 't' for each path as a combination of positions in each column with the last column being 'i' then adding the maximum value from possible moves in the next column over 'i-1' until 'i-n'. If we create another identical graph we can store the maximum for each cell traversing from the back. Once we reach the front we can select the position that will get us the most gold and have the correct amount.

Keeping in mind the time frame of only a hour or two and following TDD a intial implementaion of a Greedy algorithm. Reasoning:

- Time frame, with TDD in mind. If anyone else were to 'contribute' if this was a actual feature the PR shouldn't break any existing code and lay the ground work for future improvements

# Implementation

In the end I choose to implement a dynamic programming solution in the end. My reason is that with large mines with lots of zeros the scoring performance of the greedy algorithm takes a huge hit and considering score becomes less ideal. 

I continued to try and follow a TDD development mindset so if anyone were to 'contibute' like in a real feature, the tests would show prevent breaking of application. Along with that breaking it up and keeping functions organized within their specific function file structure wise.

In the end the algorithm is of O(nm) polynomial time complexity which is much better than a recursive solution which would become exponential time.

# Future thoughts

A look ahead could potentially be combined to eliminate zero 'traps' where the local max leads to zeros so the second should be picked potentially for the long run.

Adding more coverage to functionality already present for more robust app.

# How it works:

- Thinking of it like a math problem, we can assume that a route is of n values. 
- if we look at it from the front we don't know which will lead to the best value
- from the back though each cell can be thought of a representation if summed of the best options of previous cells
- if total gold = (i - n) + (i -n + 1)... then we can work through the array by each column from the back
- after each right will have the total collected. For the scoring we can keep the route to be run through

# Personal best scores
Mine 'jupiter' score: 6960
Mine 'luna' score: 71
Mine 'mars' score: 707
Final score: 7738

***OTHER***
- please run after repo download for usage: npm i
- To run tests use command: npm run test
