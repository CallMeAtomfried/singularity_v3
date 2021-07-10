// Markov process

const Markov = require("ooer-markov");
const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
var markov = new Markov();

markov.load("./markovdata/words.json");
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
	process.send("heartbeat");
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
	 process.send("online");
});

process.on('message', (m) => {
  if (m == "shutdown") {
	  process.send("shutting down");
	  process.exit();
  }
});

client.login(config.token);