const Markov = require("./markov.js");
var markov = new Markov();


module.exports = {
	name: "scatterbrain",
	description: "Bot loses its mind",
	help: "Usage: <pre>scatterbrain",
	category: "Markov",
	execute(message, args) {
		var msgs = message.channel.messages.cache.array();
		var collectedMessages = "";
		for(var x = 500; x > 0; x--) {
			if(msgs[msgs.length-x]) collectedMessages += `${msgs[msgs.length-x]}\n`
			
		}
		markov.learn(collectedMessages, 4)
		message.channel.send(markov.reproduce(Math.floor(Math.random()*400),4))
		markov.reset();
	}
	
}