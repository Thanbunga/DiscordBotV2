const { MessageEmbed } = require("discord.js");

exports.execute = async (client, message, args) => {
  // Fetch user's current balance
  let userBalance = await client.eco.fetchMoney(message.author.id);

  // Check if the user has enough balance
  if (userBalance.amount < 1) return message.channel.send("Looks like you are poor.");

  // Ensure the item and amount are specified
  let item = args[0];
  let amount = parseInt(args[1]);

  if (!item) return message.channel.send("What are you trying to buy?");
  if (isNaN(amount) || amount < 1) return message.channel.send("Please specify a valid amount to buy.");

  // Fetch the item from the shop
  let hasItem = client.shop[item];
  if (!hasItem) return message.reply("That item doesn't exist.");

  // Calculate total cost
  let totalCost = hasItem.cost * amount;

  // Check if the user has enough balance
  if (userBalance.amount < totalCost) {
    return message.reply(`Your balance is insufficient. You need :coin: ${totalCost} to buy ${amount} of this item.`);
  }

  // Remove the money for the purchase
  await client.eco.removeMoney(message.author.id, totalCost);

  // Create the item structure to add to the user's inventory
  let itemStruct = {
    name: item.toLowerCase(),
    prize: hasItem.cost,
  };

  // Add the item to the user's inventory in the database
  for (let i = 0; i < amount; i++) {
    client.db.push(`items_${message.author.id}`, itemStruct);
  }

  // Send confirmation message
  return message.channel.send(`You purchased **${amount} ${item}(s)** for **${totalCost}** :coin:.`);
};

exports.help = {
  name: "buy",
  aliases: [],
  usage: "buy <item> <amount>"
};
