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
