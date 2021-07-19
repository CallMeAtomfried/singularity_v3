const Markov = require("./markov.js");
var gib = new Markov();
module.exports = {
	name: "gibberish",
	description: "Generates gibberish from a given text or the last message.",
	help: "Usage: <pre>gibberish (Text)",
	category: "Markov",
	execute(message, args) {
		var textOut = "Error!"
		var textIn = message.content.substring(message.content.split(" ")[0].length);
		if(!textIn) {
			var msgs = message.channel.messages.cache.array();
			var msg = msgs[msgs.length-2]
			console.log(msg.content);
			if(msg.content) {
				gib.learn(msg.content, 1);
				message.channel.send(gib.reproduce(Math.floor(Math.random()*200), 1));
				gib.reset();
			} else {
				message.channel.send("ERROR!");
			}
		} else {
			gib.learn(textIn, 1);
			message.channel.send(gib.reproduce(Math.floor(Math.random()*200), 1));
			gib.reset();
		}
		
	}
	
}