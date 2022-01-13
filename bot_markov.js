// Markov process
process.send({target: "watchdog", action: "return", "return": "starting"})
const Markov = require("./util/markov.js");
const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const Guild = require("./util/guilds.js");
const fs = require("fs");
var guilds = {};

var markov = new Markov();
var coinword = new Markov();

markov.load("./markovdata/words.json");
coinword.load("./markovdata/english.json");

const englishWords = fs.readFileSync("./markovdata/english.txt").toString().split("\r\n");

setInterval(function(){tick()}, 10000);

function stringify(inputArray) {
	var out = "";
	for (var x in inputArray) {
		out += inputArray[x]
		out += " "
	}
	return out
}

function tick() {
	markov.save("./markovdata/words.json");
	process.send({target: "watchdog", action: "heartbeat"});
}

function coin(m) {
	var out = "";
	for (var w in m.data.array) {
		// if(m.data.array[w] == "\n") m.data.array[w] = null;
		var add = "";
		while(englishWords.includes(add) || add.length < 3 || add == m.data.array[w]) {
			add = (coinword.reproduce(100, 3, m.data.array[w], "\n").replace(/\n/g, ""))
		}
		out += add
		out += " "
	}
	if (m.data.dm) {
		client.users.cache.get(m.data.channel).send(out);
	} else {
		client.channels.cache.get(m.data.channel).send(out);
	}
}

function userdm(message) {
	var chance = message.content.split(" ").length / 10;
	var rand = Math.random();
	
	if (rand < chance) {
		var wordarray = message.content.split(" ");
		var randWord = wordarray[Math.floor(Math.random() * wordarray.length)];
		client.users.cache.get(message.author.id).send(stringify(markov.reproduce(Math.floor(Math.random() * 500), 2, randWord)));
	} else {
		client.users.cache.get(message.author.id).send(stringify(markov.reproduce(Math.floor(Math.random() * 500), 2)));
	}
	
	
}


client.on("message", (message) => {
	if (message.channel.type === "dm") {
		if (!message.content.startsWith("$")) {
			if (message.author != "601089040107831331" && message.author != 601089040107831331) {
				// message.channel.send(stringify(markov.reproduce(Math.floor(Math.random() * 500), 2)));
				userdm(message);
			}
		}
	} else {
		var guild = new Guild(message.guild.id);
		guild.loadSettings();
		if (message.mentions.has(client.user)) {
			message.channel.send(stringify(markov.reproduce(Math.floor(Math.random() * 500), 3)));
		}
		
		if (guild.settings.settings.learn && message.author.id != client.user.id && !message.content.startsWith(guild.settings.settings.prefix) && !message.content.startsWith("--") && !config.blacklistguilds.includes(message.guild.id)) {
			markov.learn(message.content.split(" "), 3);
			markov.learn(message.content.split(" "), 2);
			markov.learn(message.content.split(" "), 1);
			process.send({target: "watchdog", action: "return", "return": "learned"});
		}
	}
});

client.on("ready", () => {
	 process.send({target: "watchdog", action: "return", "return":"online"});
});

process.on('message', (m) => {
	if (m.action == "command") {
		switch (m.command) {
			case "shutdown":
				process.send({target: "watchdog", action: "return", "return":"shutting down"});
				process.exit();
				break;
			case "coinword":
				coin(m);
				break;
			case "reproduce":
				if (m.data.dm) { 
					client.users.cache.get(m.data.channel).send(stringify(markov.reproduce(Math.floor( 1000), 2, m.data.text.substring(10))));
				} else {
					var guild = new Guild(m.guild);
					guild.loadSettings();
					reptext = m.data.text.substring((`${guild.settings.settings.prefix}reproduce`).trim().length) || null
					client.channels.cache.get(m.data.channel).send(stringify(markov.reproduce(Math.floor(Math.random() * 500), 2, reptext)));
				}
				break;
			case "randommessage":
			var t1 = Date.now()
				var wordarray = m.data.text.split(" ");
				// console.log("array", wordarray);
				var randWord = wordarray[Math.floor(Math.random() * wordarray.length)];
				// console.log("randword:", randWord);
				client.channels.cache.get(m.data.channel).send(stringify(markov.reproduce(Math.floor(Math.random() * 500), 2, randWord)));
				console.log(Date.now() - t1, "ms");
				break
			case "userdm":
				userdm(m);
				break
		}
	}
  
});

client.login(config.token);