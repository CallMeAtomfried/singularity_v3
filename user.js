process.send({target: "watchdog", action: "return", "return": "starting"})
const fs = require("fs");
const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
var globalAdmins = ["354275704457789451", "586547885320175629"]
var userdb = JSON.parse(fs.readFileSync("./data/users.json").toString())
setInterval(function(){tick()}, 4000);
// setInterval(function(){save()}, 10000);
// console.log(process);
function save() {
	fs.writeFileSync("./data/users.json", JSON.stringify(userdb), function(){console.log("Saved userdb")});
}

function tick() {
	process.send({target: "watchdog", action: "heartbeat"});
	save();
}

client.on("ready", () => {
	process.send({target: "watchdog", action: "return", "return":"online"});
})

process.on('message', (m) => {
	if (m.action == "command") {
		switch (m.command) {
			case "shutdown":
				process.send({target: "watchdog", action: "return", "return":"shutting down"});
				process.exit();
				break;
			case "getxp":
				getXP(m);
				break;
			case "addxp":
				addXP(m);
				break;
			case "setxp":
				setxp(m);
				break;
			case "getbalance":
				getBalance(m);
				break;
			case "addbalance":
				addBalance(m)
				break;
			case "setbalance":
				setbalance(m);
				break;
			case "addmsgstat":
				setMsgs(m)
				break;
			case "givemoney":
				transferMoney(m);
				break;
		}
	}
	
});



function transferMoney(message) {
	if (globalAdmins.includes(message.data.sender.id)) {
		giftMoney(message);
		return;
	}
	
	if (userdb[message.data.sender.id] == undefined) {
		userdb[message.data.sender.id] = {xp: 0, balance: 0, messages: 0};
		client.channels.cache.get(message.data.channel).send(
		{
		  "embed": {
			"title": `You can only send at most 75% of your total balance!`,
			"color": 5904774,
			"footer": {
			  "text": `Requested by ${message.data.sender.username}#${message.data.sender.discriminator}`
			},
			"author": {
			  "name": `Not enough money!`,
			  "icon_url": `https://images.discordapp.net/avatars/${message.data.userId}/${message.data.Avatar}.png?size=1024`
			}
		  }
		});
		return
	}
	if (userdb[message.data.recipient.id] == undefined) {
		userdb[message.data.recipient.id] = {xp: 0, balance: 0, messages: 0};
	}
	
	var senderBalance = userdb[message.data.sender.id];
	if (message.data.amount <= 0) {
		client.channels.cache.get(message.data.channel).send(
		{
		  "embed": {
			"title": `You cannot take money away from someone`,
			"color": 5904774,
			"footer": {
			  "text": `Requested by ${message.data.sender.username}#${message.data.sender.discriminator}`
			},
			"author": {
			  "name": `Nice try!`,
			  "icon_url": `https://images.discordapp.net/avatars/${message.userId}/${message.Avatar}.png?size=1024`
			}
		  }
		});
		return
	}
	
	if (message.data.amount >= (0.75 * senderBalance)) {
		
		client.channels.cache.get(message.data.channel).send(
		{
		  "embed": {
			"title": `You can only send at most 75% of your total balance!`,
			"color": 5904774,
			"footer": {
			  "text": `Requested by ${message.data.sender.username}#${message.data.sender.discriminator}`
			},
			"author": {
			  "name": `Not enough money!`,
			  "icon_url": `https://images.discordapp.net/avatars/${message.userId}/${message.Avatar}.png?size=1024`
			}
		  }
		});
		
	} else {
		userdb[message.data.sender.id].balance -= message.data.amount;
		userdb[message.data.recipient.id].balance += message.data.amount;
		
		var messages = ["How generous!", "ooo big spender", "Money well spent!", "You cannot buy friends", "That's so nice of you"]
		var amtString = message.data.amount / 100
		client.channels.cache.get(message.data.channel).send(
		{
		  "embed": {
			"title": `You paid ${message.data.recipient.username}#${message.data.recipient.discriminator} ${amtString} ₳`,
			"color": 5904774,
			"footer": {
			  "text": `${message.data.sender.username}#${message.data.sender.discriminator}`
			},
			"author": {
			  "name": `${messages[Math.floor(Math.random() * messages.length)]}`
			}
		  }
		});
		
	}
}

// Bot owner money transfer
function giftMoney(message) {
	
	if (userdb[message.data.recipient.id] == undefined) {
		userdb[message.data.recipient.id] = {xp: 0, balance: 0, messages: 0};
	}
	
	var amtString = Math.abs(message.amount) / 100;
	if (message.data.amount % 100 == 0) amtString += ".0"
	if (message.data.amount % 10 == 0) amtString += "0"
	amtString += " ₳"
	userdb[message.data.recipient.id].balance += message.amount;
	if (message.amount < 0) {
		var messages = ["Taxes!", "It's gone forever!", "Should not have angered me!", "Suffer", "Gonna cry? Gonna piss ur pants maybe?"]
		var title = `Took ${amtString} away from ${message.data.recipient.username}#${message.data.recipient.discriminator}.`
	} else {
		var messages = ["Consider yourself lucky", "Immeasurable generosity", "Might've been a mistake", "Say thanks", "Buy something nice"]
		var title = `Gifted ${message.data.recipient.username}#${message.data.recipient.discriminator} ${amtString}.`
	}
	
	if (userdb[message.data.recipient.id].balance < 0) userdb[message.data.recipient.id].balance = 0;
	
	client.channels.cache.get(message.data.channel).send(
		{
		  "embed": {
			"title": title,
			"color": 5904774,
			"footer": {
			  "text": `${message.data.sender.username}#${message.data.sender.discriminator}`
			},
			"author": {
			  "name": `${messages[Math.floor(Math.random() * messages.length)]}`
			}
		  }
		});
	
}

function addXP(message) {
	// {command: addxp, user: string, amt: int}
	
	if (userdb[message.data.user] == undefined) {
		userdb[message.data.user] = {xp: message.data.amt, balance: 0, messages: 1};
	}
	userdb[message.data.user].xp += message.data.amt;
}

function addBalance(message) {
	// {command: addbalance, user: string, amt: int}
	if (userdb[message.data.recipient.id] == undefined) {
		userdb[message.data.recipient.id] = {balance: message.data.amount, xp: 1, messages: 1};
	}
	userdb[message.recipient.id].balance += message.data.amount;
}

function setMsgs(message) {
	// {command: addmsgstat, user: string, amt: int}
	if (userdb[message.data.user] == undefined) {
		userdb[message.data.user] = {balance: 0, xp: 0, messages: 1};
	}
	userdb[message.data.user].messages++;
}

function getXP(message) {
	if (userdb[message.data.target.id] == undefined) {
		userdb[message.data.target.id] = {xp: 0, balance: 0, messages: 0};
	}
	var bal = userdb[message.data.target.id].xp;
	var level = Math.floor(Math.log10(0.9 * bal + 1)+ 0.5*Math.sqrt(bal))
	if (message.data.dm) {
		client.users.cache.get(message.data.channel).send(
			{
			  "embed": {
				"title": `${bal}XP\n(Level ${level})`,
				"color": 5904774,
				"footer": {
				  "icon_url": `https://images.discordapp.net/avatars/${message.data.requester.id}/${message.data.requester.avatar}.png?size=1024`,
				  "text": `Requested by ${message.data.requester.username}#${message.data.requester.discriminator}`
				},
				"author": {
				  "name": `${message.data.target.username}#${message.data.target.discriminator}'s XP`,
				  "icon_url": `https://images.discordapp.net/avatars/${message.data.target.id}/${message.data.target.avatar}.png?size=1024`
				}
			}
		});
	} else {
		client.channels.cache.get(message.data.channel).send(
			{
			  "embed": {
				"title": `${bal}XP\n(Level ${level})`,
				"color": 5904774,
				"footer": {
				  "icon_url": `https://images.discordapp.net/avatars/${message.data.requester.id}/${message.data.requester.avatar}.png?size=1024`,
				  "text": `Requested by ${message.data.requester.username}#${message.data.requester.discriminator}`
				},
				"author": {
				  "name": `${message.data.target.username}#${message.data.target.discriminator}'s XP`,
				  "icon_url": `https://images.discordapp.net/avatars/${message.data.target.id}/${message.data.target.avatar}.png?size=1024`
				}
			}
		});
	}
}

function getBalance(message) {
	if (userdb[message.data.target.id] == undefined) {
		userdb[message.data.target.id] = {xp: 0, balance: 0, messages: 0};
	}
	var bal = (userdb[message.data.target.id].balance / 100);
	if (userdb[message.data.target.id].balance % 100 == 0) bal += ".0"
	if (userdb[message.data.target.id].balance % 10 == 0) bal += "0"
	
	if (message.data.dm) {
		client.users.cache.get(message.data.channel).send(
			{
			  "embed": {
				"title": `${bal} ₳`,
				"color": 5904774,
				"footer": {
				  "icon_url": `https://images.discordapp.net/avatars/${message.data.requester.id}/${message.data.requester.avatar}.png?size=1024`,
				  "text": `Requested by ${message.data.requester.username}#${message.data.requester.discriminator}`
				},
				"author": {
				  "name": `${message.data.target.username}#${message.data.target.discriminator}'s balance`,
				  "icon_url": `https://images.discordapp.net/avatars/${message.data.target.id}/${message.data.target.avatar}.png?size=1024`
				}
			  }
			});
	} else {
	
		client.channels.cache.get(message.data.channel).send(
			{
			  "embed": {
				"title": `${bal} ₳`,
				"color": 5904774,
				"footer": {
				  "icon_url": `https://images.discordapp.net/avatars/${message.data.requester.id}/${message.data.requester.avatar}.png?size=1024`,
				  "text": `Requested by ${message.data.requester.username}#${message.data.requester.discriminator}`
				},
				"author": {
				  "name": `${message.data.target.username}#${message.data.target.discriminator}'s balance`,
				  "icon_url": `https://images.discordapp.net/avatars/${message.data.target.id}/${message.data.target.avatar}.png?size=1024`
				}
			  }
			});
	}
}


client.login(config.token);