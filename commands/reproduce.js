const Markov = require("./markov.js")
var markov = new Markov();

module.exports = {
	name: "reproduce",
	description: "Generate a markov generated sentence",
	help: "Usage: <pre>reproduce",
	category: "Markov",
	execute(message, args) {
		markov.load("./markovdata/messages.json");
		message.channel.send(markov.reproduce(Math.floor(Math.random()*200), 4));
	}
	
}