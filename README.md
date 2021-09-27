# Gold Mine

The requirement for this exercise was to find the maximum gold and provide the final scores for of gold. There are certain rules we have to take care of while moving the miner:

1- The miner can either move right, diagonally right up or diagonally right down.
2- If the miner's next step is 0, then it should stop and return the scores.
3- If the miner is at row 0 then right up diagonal will be undefined hence we have to handle that.
4- If the miner is at last row then right down diagonal will be undefined hence we have to handle that.
5- Miner cant repeat the previous move.

# For Example:

9 1 5
4 2 0
5 6 9

If the miner is at 1 (First row, second column) then there will be three possibilities:
- diagonally up: As digonally up wont exist because there is no row before it hence it will avoid going there and will choose between right and diagonal down.
- Right: The value to the right is 5 hence the miner will compare the gold between right and diagonal down, and if previous move was not right then it will take in 5.
- Diagonally down: The value diagonally down is 0 and when compared with right it is smaller so the miner will not go to collect this gold, but incase if previous move was right then miner will not have any other option but to move diagonal down where the code will stop and whatever the miner has gained so far will be shown in output.

# Final Scores:

After running the code you should get scores as mentioned below:
1- Luna: 58
2- Mars: 637
3- Jupiter: 1111

Although the scores are not as perfect as they are suppose to be or in top 10 but I tried to keep the code as simple as possible.