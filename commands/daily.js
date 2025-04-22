module.exports.execute = async (client, message, args) => {
    let amount = Math.floor(Math.random() * 50) + 10;
    let addMoney = client.eco.daily(client.ecoAddUser, amount);
    if (addMoney.onCooldown) return message.reply(`You have already claimed your daily credit. Come back after ${addMoney.time.hours} hours, ${addMoney.time.minutes} minutes & ${addMoney.time.seconds} seconds to claim it again.`);
    else return message.reply(`You have claimed **${addMoney.amount}** :coin: as your daily credit & now you have **${addMoney.after}** :coin:.`);
};

module.exports.help = {
    name: "daily",
    aliases: [],
    usage: "daily"
}
