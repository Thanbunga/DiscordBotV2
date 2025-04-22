const fs = require('fs');
const Discord = require("discord.js");
 const client = new Discord.Client({ disableMentions: 'everyone' });
const Eco = require("quick.eco");
client.eco = new Eco.Manager(); // quick.eco
client.db = Eco.db; // quick.db
client.config = require("./botConfig");
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

let AmazonStock = 227, 
    AppleStock = 242, 
    MicrosoftStock = 343, 
    NvidiaStock = 142, 
    AlphabetStock = 176;

setInterval(updatePrices, 10000);
function updatePrices() {
  AmazonStock = AmazonStock + (Math.floor(Math.random() * (AmazonStock * 0.15)) + 1) - (Math.floor(Math.random() * (AmazonStock * 0.15)) + 1);
  client.shop.Amazon.cost = AmazonStock;
  AppleStock = AppleStock + (Math.floor(Math.random() * (AppleStock * 0.15)) + 1) - (Math.floor(Math.random() * (AppleStock * 0.15)) + 1);
  client.shop.Apple.cost = AppleStock;
  MicrosoftStock = MicrosoftStock + (Math.floor(Math.random() * (MicrosoftStock * 0.15)) + 1) - (Math.floor(Math.random() * (MicrosoftStock * 0.15)) + 1);
  client.shop.Microsoft.cost = MicrosoftStock;
  NvidiaStock = NvidiaStock + (Math.floor(Math.random() * (NvidiaStock * 0.15)) + 1) - (Math.floor(Math.random() * (NvidiaStock * 0.15)) + 1);
  client.shop.Nvidia.cost = NvidiaStock;
  AlphabetStock = AlphabetStock + (Math.floor(Math.random() * (AlphabetStock * 0.15)) + 1) - (Math.floor(Math.random() * (AlphabetStock * 0.15)) + 1);
  client.shop.Alphabet.cost = AlphabetStock;
}

client.shop = {
  "Amazon" : {
    cost: AmazonStock
  },
  "Apple" : {
    cost: AppleStock
  },
  "Microsoft" : {
    cost: MicrosoftStock
  },
  "Nvidia" : {
    cost: NvidiaStock
  },
  "Alphabet" : {
    cost: AlphabetStock
  }
};

fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(f => {
        if (!f.endsWith(".js")) return;
        const event = require(`./events/${f}`);
        let eventName = f.split(".")[0];
        console.log(`Registering event: ${eventName}`);
        client.on(eventName, event.bind(null, client));
    });
});

fs.readdir("./commands/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(f => {
        if (!f.endsWith(".js")) return;
        let command = require(`./commands/${f}`);
        client.commands.set(command.help.name, command);
        console.log(`Registering command: ${command}`);
        command.help.aliases.forEach(alias => {
            client.aliases.set(alias, command.help.name);
        });
    });
});


client.login(client.config.token);
