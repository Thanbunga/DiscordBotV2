const { MessageEmbed } = require("discord.js");

exports.execute = async (client, message, args) => {
  // Fetch user's current balance
  let userBalance = await client.eco.fetchMoney(message.author.id);

  // Check if the user has entered both arguments (number of balls and cost per ball)
  let numBalls = parseInt(args[0]);
  let costPerBall = parseInt(args[1]);

  // Ensure the arguments are valid numbers
  if (isNaN(numBalls) || isNaN(costPerBall) || numBalls < 1 || costPerBall < 1) {
    return message.channel.send("Please provide valid numbers for the number of balls and cost per ball.");
  }

  // Check if the user has enough balance to play (number of balls * cost per ball)
  let totalCost = numBalls * costPerBall;
  if (userBalance.amount < totalCost) {
    return message.channel.send(`You don't have enough :coin: to play. You need ${totalCost} :coin:, but you only have ${userBalance.amount} :coin:.`);
  }

  // Deduct the total cost from the user's balance
  await client.eco.removeMoney(message.author.id, totalCost);

  // Simulate the Plinko game
  let outcomes = [];
  for (let i = 0; i < numBalls; i++) {
    // Randomly determine the outcome for each ball, represented as a multiplier on the cost
    let multiplier = Math.random();
    if (multiplier < 0.002) {
      // 5% chance for a huge win (e.g., 10x the ball's cost)
      outcomes.push(costPerBall * 100);
    } else if (multiplier < 0.01) {
      // 5% chance for a huge win (e.g., 10x the ball's cost)
      outcomes.push(costPerBall * 10);
    } else if (multiplier < 0.02) {
      // 10% chance for a decent win (e.g., 5x the ball's cost)
      outcomes.push(costPerBall * 5);
    } else if (multiplier < 0.1) {
      // 20% chance for a small win (e.g., 2x the ball's cost)
      outcomes.push(costPerBall * 2);
    } else if (multiplier < 0.4) {
      // 40% chance for a break-even (1x the ball's cost)
      outcomes.push(costPerBall);
    } else {
      // 25% chance for no win (0x the ball's cost)
      outcomes.push(0);
    }
  }

  // Calculate the total win based on the outcomes
  let totalWin = outcomes.reduce((acc, outcome) => acc + outcome, 0);

  // Add the total win to the user's balance
  await client.eco.addMoney(message.author.id, totalWin);

  // Send the result message
  if (totalWin > 0) {
    return message.channel.send(`You played with **${numBalls} balls** and spent **${totalCost}** :coin:. You won **${totalWin}** :coin:!`);
  } else {
    return message.channel.send(`You played with **${numBalls} balls** and spent **${totalCost}** :coin:. Unfortunately, you didn't win anything this time.`);
  }
};

exports.help = {
  name: "plinko",
  aliases: [],
  usage: "plinko <number of balls> <cost per ball>"
};