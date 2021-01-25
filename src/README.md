# Intial Thoughts

After reading the problem my first thought is that this should be solved recursively or with DP. A simple brute force approach would be to always take the local maximum and backtrack on zeros, but the problem with this is that while the next number route may be the highest it could miss a even higher value resulting in a larger end value.

My next though is to just run through the whole graph using a modified DFS algorithm the problem with this is that you technical have 'm' graphs of 'n' length running through all of them is exponential time and is not ideal.

Looking at the problem further we can try the approach of breaking it down into small problem set. If you think of the total 't' for each path as a combination of positions in each column with the last column being 'i' then adding the maximum value from possible moves in the next column over 'i-1' until 'i-n'. If we create another identical graph we can store the maximum for each cell traversing from the back. Once we reach the front we can select the position that will get us the most gold and have the correct amount.

Keeping in mind the time frame of only a hour or two and following TDD a intial implementaion of a Greedy algorithm. Reasoning:

- Time frame, with TDD in mind. If anyone else were to 'contribute' if this was a actual feature the PR shouldn't break any existing code and lay the ground work for future improvements
