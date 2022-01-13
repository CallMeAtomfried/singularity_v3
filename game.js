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
		case "mastermind":
			initPlayer(m);
			break
		}
	}
});

function deleteGame(game) {
	mastermindplayers[game] = null;
}

client.on("message", (message) => {
	if (mastermindplayers[message.author.id]) {
		mastermind(message);
	}
	
	
	
})

function initPlayer(m) {
	var players = Object.keys(mastermindplayers)
	
	if (!mastermindplayers[m.message.authorID]) {
		let Game = require("./util/game.js");
		if (m.idDm) {
			let game = new Game(m.message.authorID, 1,  m.isDm);
			mastermindplayers[m.message.authorID] = [m.message.authorID, game, Date.now()]
			setTimeout(function() {deleteGame(m.message.authorID)}, 600000);
		} else {
			let game = new Game(m.message.authorID, 1,  m.isDm);
			mastermindplayers[m.message.authorID] = [m.message.channelID, game, Date.now()]
			setTimeout(function() {deleteGame(m.message.authorID)}, 600000);
		}
	}
}

function mastermind(message) {
	
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
	
}


client.login(config.token);
