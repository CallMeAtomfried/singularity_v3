const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs")
const config = require("./config.json");
var mutes = require("./data/mutes.json");

const Mute = require("./util/mute.js");
console.log(mutes)
const Command = require("./util/commands.js");
const Guild = require("./util/guilds.js");
const Markov = require("./util/markov.js");
const User = require("./util/user.js");

var guilds = {};
var commandHandler = new Command();
var markov = new Markov();


if(fs.existsSync("./markovdata/messages.json")&&fs.readFileSync("./markovdata/messages.json").toString()!="") {
	
	markov.load("./markovdata/messages.json");
} else {
	markov.save("./markovdata/messages.json");
}

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



//Regular execution
setInterval(function(){tick()}, 1000);
setInterval(function(){markov.save("./markovdata/messages.json")}),

// commandHandler.commands["ping"].execute();

client.on("ready", () => {
	console.log("I am ready!");
	getUsers();
	
});


client.on("message", (message) => {
	if(!message.author.bot) {
		//check if guild is known
		if(guilds[message.guild.id]==undefined) {
			guilds[message.guild.id] = new Guild(message.guild.id);
			guilds[message.guild.id].loadSettings();
		}
		if(message.content.startsWith(`${guilds[message.guild.id].settings.settings.prefix}help`)) {
			commandHandler.help(message, guilds[message.guild.id]);
		} else if(message.content.startsWith(guilds[message.guild.id].settings.settings.prefix)) {
			commandHandler.handler(message, guilds[message.guild.id], client);
		}
		var user = new User(message.author.id);
		user.updateStatistics(2, 1);
		user.saveStatistics();
		
	}
	
	
	
	
	
	//Global admin only stuff
	if(message.author.id==354275704457789451) {
		//Roll out updates to guilds
		if(message.content=="--rollout") {
			let Update = require("./util/rollout.js");
			let rollout = new Update(guilds);
			rollout.rolloutSettings();
		}
	}
	
	
	if(message.author.id==601089040107831331&&message.content=="Pinging...") {
		var prevCommand = message.channel.messages.array()[message.channel.messages.array().length-2]
		if(prevCommand.content.endsWith("ping")) {
			var time = prevCommand.createdTimestamp;
			message.channel.fetchMessages({around: message.id, limit: 1})
				.then(msg => {
					const fetchedMsg = msg.first();
					fetchedMsg.edit(`Ping:\n${message.createdTimestamp-time}ms`);
				});
		}
	}
	
	//Markov learning
	// if(message.author.id!=601089040107831331) {
		// markov.learn(message.content, 6);
		// markov.learn(message.content, 5);
		// markov.learn(message.content, 4);
		// markov.learn(message.content, 3);
		// markov.learn(message.content, 2);
		// markov.learn(message.content, 1);
		// console.log("Learned");
	// }
});

function tick() {
	for(guild in mutes.guilds) {
		console.log(guild)
	}
}

client.login(config.token);