const { MessageEmbed } = require("discord.js");

exports.execute = async (client, message, args) => {
  // Fetch user's current balance
  let userBalance = await client.eco.fetchMoney(message.author.id);

  // Check if the user has enough balance to gamble
  let gambleAmount = parseInt(args[0]);

  // Ensure the amount is provided and is a valid number
  if (isNaN(gambleAmount) || gambleAmount < 1) {
    return message.channel.send("Please provide a valid amount to gamble.");
  }

  // Check if the user has enough :coin:
  if (userBalance.amount < gambleAmount) {
    return message.channel.send(`You don't have enough :coin: to gamble. You have ${userBalance.amount} :coin:.`);
  }

  // Deduct the gamble amount from the user's balance
  await client.eco.removeMoney(message.author.id, gambleAmount);

  // Generate a random result to determine which tier the user falls into
  let winTier = Math.random();

  // Define win amounts based on tiers
  let winAmount;

  if (winTier < 0.01) {
    // Tier 4 win (5% chance)
    winAmount = Math.floor((gambleAmount + Math.random() * 32) * 32); // Random amount between gambleAmount and gambleAmount + 8
    await client.eco.addMoney(message.author.id, winAmount);
    return message.channel.send(`Congratulations! You won and received ${winAmount} :coin:.`);
  } else if (winTier < 0.02) {
    // Tier 4 win (5% chance)
    winAmount = Math.floor((gambleAmount + Math.random() * 16) * 16); // Random amount between gambleAmount and gambleAmount + 8
    await client.eco.addMoney(message.author.id, winAmount);
    return message.channel.send(`Congratulations! You won and received ${winAmount} :coin:.`);
  } else if (winTier < 0.05) {
    // Tier 4 win (5% chance)
    winAmount = Math.floor((gambleAmount + Math.random() * 8) * 8); // Random amount between gambleAmount and gambleAmount + 8
    await client.eco.addMoney(message.author.id, winAmount);
    return message.channel.send(`Congratulations! You won and received ${winAmount} :coin:.`);
  } else if (winTier < 0.125) {
    // Tier 3 win (12.5% chance, cumulative chance is 5% + 12.5%)
    winAmount = Math.floor((gambleAmount + Math.random() * 4) * 4); // Random amount between gambleAmount and gambleAmount + 4
    await client.eco.addMoney(message.author.id, winAmount);
    return message.channel.send(`Congratulations! You won and received ${winAmount} :coin:.`);
  } else if (winTier < 0.25) {
    // Tier 2 win (25% chance, cumulative chance is 5% + 12.5% + 25%)
    winAmount = Math.floor((gambleAmount + Math.random() * 2) * 2); // Random amount between gambleAmount and gambleAmount + 2
    await client.eco.addMoney(message.author.id, winAmount);
    return message.channel.send(`Congratulations! You won and received ${winAmount} :coin:.`);
  } else if (winTier < 0.75) {
    // Tier 1 win (50% chance, cumulative chance is 5% + 12.5% + 25% + 50%)
    winAmount = gambleAmount; // No extra :coin:, just the bet amount
    await client.eco.addMoney(message.author.id, winAmount);
    return message.channel.send(`Congratulations! You won and received ${winAmount} :coin:.`);
  } else {
    // User loses, notify them
    return message.channel.send(`You lost the gamble. You lost ${gambleAmount} :coin:. Better luck next time!`);
  }
};

exports.help = {
  name: "slots",
  aliases: [],
  usage: "slots <amount>"
};