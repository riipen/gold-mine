# gold-mine

Riipen's technical interview "Gold Mine" problem.

# Solving processes

This problem looks like a "Greedy" or "Dynamic Programming" problem. The "Greedy" algorithm usually cannot get the best solution, so I think DP(Dynamic Programming) can be a better choice here. The result of the current position always depends on the result starting from the three positions to the right.

## 1. Simplify the Problem

Firstly, simplify the problem, focus on the main issue first. And try to implement the simplified algorithm base on "luna" data.

I assume the miner always starts moving from (0,0) and can repeat the last move direction. They should be easier to implement later by adding some "if conditions."
Break the problem into sub-problems. Every movement has almost similar processes, which is just checking the right three entries. The given method "Position.isValid" can be used as the boundary condition.

The recursive function logic looks like this:

F(x,y)= currentScore + max(F(x+1,y-1),F(x+1,y), F(x+1,y+1))

Then implement the algorithm. I notice some duplicate processes in the recursive function; the "child trees" can be calculated repeatedly. So I added a global variable to save the result of each round and improve the performance. The global variable kept every position's info, including the best total score and last moving direction.

## 2. Add More Features

Secondly, add more features in the first version algorithm. Think about the condition when the miner cannot repeat the not just moving from (0,0).

For the best entry position problem, my solution is checking all entries. And return the entry that has maximum scores in the helper variable, which contains all processing records. Because I have cached all processing results, there is no additional time-consuming in this process.

For the other requirement(no-repeat moving directions), I added some "if conditions" in the recursive function before comparing the best score of the right three positions.

## 3. Polish

Thirdly, Check some special cases ( like score-0 positions, boundaries ) and test the algorithm with larger-size testing data ("Jupiter" and "Mars").

# Result

Riipen Gold Miner

- Mine 'jupiter' score: 7072
- Mine 'luna' score: 67
- Mine 'mars' score: 721
- Final score: 7860
