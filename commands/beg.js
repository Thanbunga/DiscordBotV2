exports.execute = async (client, message, args) => {
    let users = [
        "PewDiePie",
        "T-Series",
        "Sans",
        "Zero"
    ];
    let amount = Math.floor(Math.random() * 5) + 1;
    let beg = client.eco.beg(client.ecoAddUser, amount, { canLose: true });
    if (beg.onCooldown) return message.reply(`Begon Thot! Come back after ${beg.time.seconds} seconds.`);
    if (beg.lost) return message.channel.send(`**${users[Math.floor(Math.random() * users.length)]}:** Begon Thot! Try again later.`);
    else return message.reply(`**${users[Math.floor(Math.random() * users.length)]}** donated you **${beg.amount}** :coin:. Now you have **${beg.after}** :coin:.`);
};

exports.help = {
    name: "beg",
    aliases: [],
    usage: "beg"
}
