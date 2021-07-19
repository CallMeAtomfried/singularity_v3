process.send({"return": "starting"})
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
	process.send({"return":"heartbeat"});
}
client.on("ready", () => {
	process.send({"return":"online"});
	// getUsers();
	
});

process.on('message', (m) => {
  switch (m.command) {
		case "shutdown":
			process.send({"return":"shutting down"});
			process.exit();
			break;
	}
});

function deleteGame(game) {
	mastermindplayers[message.author.id] = null;
}

client.on("message", (message) => {
	if(message.author.id == "601089040107831331" && message.content.startsWith("Successfully set")) {
		guilds[message.guild.id].loadSettings();
	}
	
	if(guilds[message.guild.id]==undefined) {
			guilds[message.guild.id] = new Guild(message.guild.id);
			guilds[message.guild.id].loadSettings();
	}
	if(message.content == `${guilds[message.guild.id].settings.settings.prefix}mastermind`) {
		
		// console.log("game");
		let Game = require("./util/game.js");
		let game = new Game(message.author.id, 1, message);
		mastermindplayers[message.author.id] = [message.channel.id, game, Date.now()]
		setTimeout(deleteGame, 600000, message.channel.id);
	}
	
	//console.log(mastermindplayers);
	if(mastermindplayers[message.author.id]&&!message.content.includes("rules")) {
		if(mastermindplayers[message.author.id][0] == message.channel.id) {
			if(mastermindplayers[message.author.id][1].currentTurn < 10) {
				mastermindplayers[message.author.id][1].nextMove(message);
			} else {
				delete mastermindplayers[message.author.id];
				
			}
		}
	}
})


client.login(config.token);
