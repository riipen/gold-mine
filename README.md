# Daelyn's thoughts

I have a few initial thoughts on this problem. First, there is definitely a greedy recursive solution where you simply pick the best starting position and iterate through picking the highest gold move, taking into account that you don't make the same move twice in a row. This has some clear issues, especially with the "twice in a row" move requirement. First, you will evidently miss out on a higher gold square later in the matrix by only looking at the 3 squares you can move to. Not only do you need to consider future squares, you also need to consider that you won't be able to make the same move twice in a row, when deciding where to go.

With this first idea you could also try all possible combinations of moves. This would be a rather brute force way but you would likely find the best route in the end.

The second idea I have is treating this like a weighted graph problem. Since we have access to the array, you could probably create a weighted graph and use some algorithm like Bellman-Ford to take the most expensive route. I don't feel like this problem warrants something like this though.

My third idea is to use dynamic programming techniques to iterate bottom-up rather than top-down so-to-speak. We would create an empty matrix and iterate through the mine backwards, not yet making any moves. We would assign the highest gold you can achieve to each square. When you finish, you would ideally have the highest gold achievable for each row, which you could then take the maximum of, and finally make all of your moves. I am not entirely sure yet how to achieve this considering the requirement to not make the same move twice in a row.

# gold-mine

Riipen's technical interview "Gold Mine" problem.

# Exercise

Given a gold mine of n \* m dimensions, design an algorithm for a gold miner to collect
as much gold as possible. Each field in this mine contains a positive integer
which is the amount of gold in that space. The miner starts at the first column but can be at any row.
The miner can only move right, diagonally right and up, or diagonally right and down. The miner
cannot repeat it's previous move (ie. if it's previous move was diagonally right and up, it can
only move right or diagonally right and down on its current move).

![Gold mine diagram](https://i.imgur.com/pmb9XCA.png "Gold Mine Diagram")

If the miner leaves the mine for any reason (goes outside the dimensions of the mine), gold collection
will cease and the final score will be the current score.

If the miner lands on a section of the mine that has zero gold (an integer value of 0), gold
collection will cease and the final score will be the current score.

# Rules

- There is no time limit
- Use your best discretion with the design of your solution
- You can ask questions
- You are free to add packages, tools, or improvements as you see fit
- We expect you write the kind of feature you would put into production, including tests and documentation as you see fit

# Submission

Fork this repository to your Github account. Make any of the changes you wish to make,
then submit a pull request back up stream to this repository.

If you can score in the top 10 of all time submissions, your name will be added to our
[leader board](https://github.com/riipen/gold-mine/wiki/Leader-Board).

# Setup

## Node

1. Install `nvm` via the instructions [here](https://github.com/nvm-sh/nvm#installation-and-update), something like:

```bash
$ curl -o- https://raw.githubusercontent.com/creationix/nvm/${VERSION}/install.sh | bash
```

2. Install `node 10.16.3` (currently latest LTS):

```bash
nvm install --lts
nvm use --lts
```

4. Upgrade npm and install local dependencies:

```bash
npm install npm@latest -g
npm install
```

## Run

To run the miner through all mines:

```bash
$ npm start
```

This will give you your score per mine, as well as your final score.

To run the miner through a specific mine:

```bash
$ npm run mine -- jupiter
```

This will run the miner through the "jupiter" mine. (All mines can be found
in the `mines/` directory.)

# Architecture

The current naive approach to mining can be found in `src/move.js`.
Your job will be to improve upon the existing implementation in order
to collect as much gold as possible.

You should not need to touch any of the other existing files.

# Contact

We encourage you to use your best discretion, but also to ask questions and communicate if you need it.
