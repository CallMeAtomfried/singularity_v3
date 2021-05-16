const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");

var mastermindplayers = {"id": ["channel", "gameobj", "starttime"]}

client.on("message", (message) => {
	if(message.content == "$mastermind") {
		
		
		let Game = require("./util/game.js");
		let game = new Game(message.author.id, 1, message);
		mastermindplayers[message.author.id] = [message.channel.id, game, Date.now()]
	}
	console.log(mastermindplayers[message.author.id]);
	
	if(mastermindplayers[message.author.id]&&!message.content.includes("rules")) {
		if(mastermindplayers[message.author.id][0] == message.channel.id) {
			if(mastermindplayers[message.author.id][1].currentTurn < 10) {
				mastermindplayers[message.author.id][1].nextMove(message);
			} else {
				delete mastermindplayers[message.author.id];
				message.reply("You lose :c")
			}
		}
	}
})


client.login(config.token);