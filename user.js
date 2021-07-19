process.send({"return": "starting"})
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
	process.send({"return":"heartbeat"});
	save();
}

client.on("ready", () => {
	process.send({"return":"online"});
})

process.on('message', (m) => {
	
	switch (m.command) {
		case "shutdown":
			process.send({"return":"shutting down"});
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
	
});



function transferMoney(message) {
	if (globalAdmins.includes(message.sender.id)) {
		giftMoney(message);
		return;
	}
	
	if (userdb[message.sender.id] == undefined) {
		userdb[message.sender.id] = {xp: 0, balance: 0, messages: 0};
		client.channels.cache.get(message.channel).send(
		{
		  "embed": {
			"title": `You can only send at most 75% of your total balance!`,
			"color": 5904774,
			"footer": {
			  "text": `Requested by ${message.sender.username}#${message.sender.discriminator}`
			},
			"author": {
			  "name": `Not enough money!`,
			  "icon_url": `https://images.discordapp.net/avatars/${message.userId}/${message.Avatar}.png?size=1024`
			}
		  }
		});
		return
	}
	if (userdb[message.recipient.id] == undefined) {
		userdb[message.recipient.id] = {xp: 0, balance: 0, messages: 0};
	}
	
	var senderBalance = userdb[message.sender.id];
	if (message.amount <= 0) {
		client.channels.cache.get(message.channel).send(
		{
		  "embed": {
			"title": `You cannot take money away from someone`,
			"color": 5904774,
			"footer": {
			  "text": `Requested by ${message.sender.username}#${message.sender.discriminator}`
			},
			"author": {
			  "name": `Nice try!`,
			  "icon_url": `https://images.discordapp.net/avatars/${message.userId}/${message.Avatar}.png?size=1024`
			}
		  }
		});
		return
	}
	
	if (message.amount >= (0.75 * senderBalance)) {
		
		client.channels.cache.get(message.channel).send(
		{
		  "embed": {
			"title": `You can only send at most 75% of your total balance!`,
			"color": 5904774,
			"footer": {
			  "text": `Requested by ${message.sender.username}#${message.sender.discriminator}`
			},
			"author": {
			  "name": `Not enough money!`,
			  "icon_url": `https://images.discordapp.net/avatars/${message.userId}/${message.Avatar}.png?size=1024`
			}
		  }
		});
		
	} else {
		userdb[message.sender.id].balance -= message.amount;
		userdb[message.recipient.id].balance += message.amount;
		
		var messages = ["How generous!", "ooo big spender", "Money well spent!", "You cannot buy friends", "That's so nice of you"]
		var amtString = message.amount / 100
		client.channels.cache.get(message.channel).send(
		{
		  "embed": {
			"title": `You paid ${message.recipient.username}#${message.recipient.discriminator} ${amtString} ₳`,
			"color": 5904774,
			"footer": {
			  "text": `${message.sender.username}#${message.sender.discriminator}`
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
	
	if (userdb[message.recipient.id] == undefined) {
		userdb[message.recipient.id] = {xp: 0, balance: 0, messages: 0};
	}
	
	var amtString = Math.abs(message.amount) / 100;
	if (message.amount % 100 == 0) amtString += ".0"
	if (message.amount % 10 == 0) amtString += "0"
	amtString += " ₳"
	userdb[message.recipient.id].balance += message.amount;
	if (message.amount < 0) {
		var messages = ["Taxes!", "It's gone forever!", "Should not have angered me!", "Suffer", "Gonna cry? Gonna piss ur pants maybe?"]
		var title = `Took ${amtString} away from ${message.recipient.username}#${message.recipient.discriminator}.`
	} else {
		var messages = ["Consider yourself lucky", "Immeasurable generosity", "Might've been a mistake", "Say thanks", "Buy something nice"]
		var title = `Gifted ${message.recipient.username}#${message.recipient.discriminator} ${amtString}.`
	}
	
	if (userdb[message.recipient.id].balance < 0) userdb[message.recipient.id].balance = 0;
	
	client.channels.cache.get(message.channel).send(
		{
		  "embed": {
			"title": title,
			"color": 5904774,
			"footer": {
			  "text": `${message.sender.username}#${message.sender.discriminator}`
			},
			"author": {
			  "name": `${messages[Math.floor(Math.random() * messages.length)]}`
			}
		  }
		});
	
}

function addXP(message) {
	// {command: addxp, user: string, amt: int}
	
	if (userdb[message.user] == undefined) {
		userdb[message.user] = {xp: message.amt, balance: 0, messages: 1};
	}
	userdb[message.user].xp += message.amt;
}

function addBalance(message) {
	// {command: addbalance, user: string, amt: int}
	if (userdb[message.user] == undefined) {
		userdb[message.user] = {balance: message.amt, xp: 1, messages: 1};
	}
	userdb[message.userid].balance += message.amt;
}

function setMsgs(message) {
	// {command: addmsgstat, user: string, amt: int}
	if (userdb[message.user] == undefined) {
		userdb[message.user] = {balance: 0, xp: 0, messages: 1};
	}
	userdb[message.user].messages++;
}

function getXP(message) {
	if (userdb[message.target.id] == undefined) {
		userdb[message.target.id] = {xp: 0, balance: 0, messages: 0};
	}
	var bal = userdb[message.target.id].xp;
	var level = Math.floor(Math.log10(0.9 * bal + 1)+ 0.5*Math.sqrt(bal))
	
	client.channels.cache.get(message.channel).send(
		{
		  "embed": {
			"title": `${bal}XP\n(Level ${level})`,
			"color": 5904774,
			"footer": {
			  "icon_url": `https://images.discordapp.net/avatars/${message.requester.id}/${message.requester.avatar}.png?size=1024`,
			  "text": `Requested by ${message.requester.username}#${message.requester.discriminator}`
			},
			"author": {
			  "name": `${message.target.username}#${message.target.discriminator}'s XP`,
			  "icon_url": `https://images.discordapp.net/avatars/${message.target.id}/${message.target.avatar}.png?size=1024`
			}
		  }
		});
}

function getBalance(message) {
	if (userdb[message.target.id] == undefined) {
		userdb[message.target.id] = {xp: 0, balance: 0, messages: 0};
	}
	var bal = (userdb[message.target.id].balance / 100);
	if (userdb[message.target.id].balance % 100 == 0) bal += ".0"
	if (userdb[message.target.id].balance % 10 == 0) bal += "0"
	
	client.channels.cache.get(message.channel).send(
		{
		  "embed": {
			"title": `${bal} ₳`,
			"color": 5904774,
			"footer": {
			  "icon_url": `https://images.discordapp.net/avatars/${message.requester.id}/${message.requester.avatar}.png?size=1024`,
			  "text": `Requested by ${message.requester.username}#${message.requester.discriminator}`
			},
			"author": {
			  "name": `${message.target.username}#${message.target.discriminator}'s balance`,
			  "icon_url": `https://images.discordapp.net/avatars/${message.target.id}/${message.target.avatar}.png?size=1024`
			}
		  }
		});
}


client.login(config.token);