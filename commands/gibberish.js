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
			if(msg.content) {
				if (msg.content.length < 75) {
					gib.learn(`${msg.content} ${msg.content}`, 1);
					message.channel.send(gib.reproduce(Math.floor(Math.random()*200), 1));
				} else {
					gib.learn(`${msg.content} ${msg.content}`, 2);
					message.channel.send(gib.reproduce(Math.floor(Math.random()*200), 2));
				}
				gib.reset();
			} else {
				message.channel.send("ERROR!");
			}
		} else {
			if (textIn.length < 75) {
				gib.learn(textIn, 1);
				message.channel.send(gib.reproduce(Math.floor(Math.random()*200), 1));
			} else {
				gib.learn(textIn, 2);
				message.channel.send(gib.reproduce(Math.floor(Math.random()*200), 2));
			}
			gib.reset();
		}
		
	}
	// 
}