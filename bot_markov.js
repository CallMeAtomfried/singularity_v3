// Markov process
process.send({"return": "starting"})
const Markov = require("ooer-markov");
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
	process.send({"return":"heartbeat"});
}

function coin(arr, channel) {
	var out = "";
	for (var w in arr) {
		if(arr[w] == "\n") arr[w] = null;
		var add = "";
		while(englishWords.includes(add) || add.length < 3 || add == arr[w]) {
			add = (coinword.reproduce(100, 3, arr[w], "\n").replace(/\n/g, ""))
		}
		out += add
		out += " "
	}
	client.channels.cache.get(channel).send(out);
}


client.on("message", (message) => {
	if (message.mentions.has(client.user)) {
		message.channel.send(stringify(markov.reproduce(Math.floor(Math.random() * 500), 2)));
	}
	// markov.learn(message.content.split(" "), 3);
	markov.learn(message.content.split(" "), 2);
	markov.learn(message.content.split(" "), 1);
});

client.on("ready", () => {
	 process.send({"return":"online"});
});

process.on('message', (m) => {
	
	switch (m.command) {
		case "shutdown":
			process.send({"return":"shutting down"});
			process.exit();
			break;
		case "coinword":
			coin(m.array, m.channel);
			break;
		case "reproduce":
			var guild = new Guild(m.guild);
			guild.loadSettings();
			reptext = m.text.substring((`${guild.settings.settings.prefix}reproduce`).trim().length) || null
			client.channels.cache.get(m.channel).send(stringify(markov.reproduce(Math.floor(Math.random() * 500), 2, reptext)));
			break;
		case "randommessage":
			var wordarray = m.text.split(" ");
			// console.log("array", wordarray);
			var randWord = wordarray[Math.floor(Math.random() * wordarray.length)];
			// console.log("randword:", randWord);
			client.channels.cache.get(m.channel).send(stringify(markov.reproduce(Math.floor(Math.random() * 500), 2, randWord)));
			break
	}
  
});

client.login(config.token);