const { MessageEmbed } = require("discord.js");

exports.execute = async (client, message, args) => {
  let userBalance = await client.eco.fetchMoney(message.author.id);
  let item = args[0];
  let amount = parseInt(args[1]);

  // Ensure the item and amount are specified
  if (!item) return message.channel.send("What are you trying to sell?");
  if (isNaN(amount) || amount < 1) return message.channel.send("Please specify a valid amount to sell.");

  // Check if the item exists in the shop
  let shopItem = client.shop[item.charAt(0).toUpperCase() + item.slice(1)]; // Capitalize the first letter to match shop key (e.g., "apple" -> "Apple")
  if (!shopItem) return message.channel.send(`The item ${item} does not exist in the shop.`);

  // Check if the user has the item in their inventory
  let userItems = client.db.get(`items_${message.author.id}`) || [];
  let userItemCount = userItems.filter(i => i.name.toLowerCase() === item.toLowerCase()).length;

  if (userItemCount < amount) return message.reply(`You don't have enough of that item to sell. You have ${userItemCount} ${item}(s) in your inventory.`);

  // Get the current price of the item from the shop
  let itemPrice = shopItem.cost;

  // Calculate the total sale price based on the current price of the item in the shop
  let totalSalePrice = itemPrice * amount;

  // Remove the specified amount of the item from the user's inventory
  for (let i = 0; i < amount; i++) {
    let itemIndex = userItems.findIndex(i => i.name.toLowerCase() === item.toLowerCase());
    if (itemIndex !== -1) userItems.splice(itemIndex, 1); // Remove one item per loop iteration
  }
  client.db.set(`items_${message.author.id}`, userItems);

  // Add the total sale price to the user's balance
  await client.eco.addMoney(message.author.id, totalSalePrice);

  return message.channel.send(`You sold **${amount} ${item}(s)** for **${totalSalePrice}** :coin:.`);
};

exports.help = {
  name: "sell",
  aliases: [],
  usage: "sell <item> <amount>"
};