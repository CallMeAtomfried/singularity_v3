process.send({target: "watchdog", action: "return", "return": "starting"})
const Discord = require("discord.js");
const client = new Discord.Client();

const config = require("./config.json");
const Guild = require("./util/guilds.js");
var mastermindplayers = {"id": ["channel", "gameobj", "starttime"]}

var guilds = {};

function getUsers() {
  let guilds = client.guilds.array();

  for (let i = 0; i < guilds.length; i++) {
    client.guilds.get(guilds[i].id).fetchMembers().then(r => {
      r.members.array().forEach(r => {
        let username = `${r.user.username}#${r.user.discriminator}`;
        // console.log(`${username}`);
      });
    });
  }
}
setInterval(function(){tick()}, 10000);

function tick() {
	process.send({target: "watchdog", action: "heartbeat"});
}
client.on("ready", () => {
	process.send({target: "watchdog", action: "return", "return":"online"});
	// getUsers();
	
});

process.on('message', (m) => {
	if (m.action == "command") {
		switch (m.command) {
		case "shutdown":
			process.send({target: "watchdog", action: "return", "return":"shutting down"});
			process.exit();
			break;
		case "retrieve":
			break
		}
	}
});

function deleteGame(game) {
	mastermindplayers[message.author.id] = null;
}

client.on("message", (message) => {
	var check = "";
	if (message.channel.type == "dm") {
		check = "$mastermind";
	} else {
		check = `${guilds[message.guild.id].settings.settings.prefix}mastermind`
	}
		
		
	if(message.content == check) {
		
		// console.log("game");
		let Game = require("./util/game.js");
		if (message.channel.type == "dm") {
			let game = new Game(message.author.id, 1, message);
			mastermindplayers[message.author.id] = [message.author.id, game, Date.now()]
			setTimeout(deleteGame, 600000, message.author.id);
		} else {
			let game = new Game(message.author.id, 1, message);
			mastermindplayers[message.author.id] = [message.channel.id, game, Date.now()]
			setTimeout(deleteGame(message.author.id), 600000, message.channel.id);
		}
	}
	
	
	if(mastermindplayers[message.author.id]&&!message.content.includes("rules")) {
		
		if (message.channel.type == "dm") {
			var channel = message.author.id;
		} else {
			var channel = message.channel.id
		}
		
		if(mastermindplayers[message.author.id][0] == channel) {
			
			if(mastermindplayers[message.author.id][1].currentTurn < 10) {
				
				mastermindplayers[message.author.id][1].nextMove(message);
			} else {
				deleteGame(message.author.id)
				delete mastermindplayers[message.author.id];
				
			}
		}
	}
	
})


client.login(config.token);
