# Steps to solve

* Identify problem constraints:
The miner have three options (UPRight,Right,DownRight).
The miner can not across the grid border.
The miner can not go to "Zeros" in grid.
The miner can not use same options as previous step.

* Challenges
How to find start point.
Implement it iteratively or recursively.
Greedy algorithm or/and DP.

* Steps to implement
Thought about start point.
Use Greedy algorithm to decide which option is better (Consider all the constraints).
Add helper function to implement the move options that miner can take and getValue functions.

* Improvement
Start point
Avoid Zeros
Add test

