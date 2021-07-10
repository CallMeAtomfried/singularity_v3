const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs")
const config = require("./config.json");
var mutes = require("./data/mutes.json");

const Mute = require("./util/mute.js");
const Command = require("./util/commands.js");
const Guild = require("./util/guilds.js");
const Markov = require("ooer-markov");
const User = require("./util/user.js");

var guilds = {};
var commandHandler = new Command();
var markov = new Markov();
var words = new Markov();
words.load("./markovdata/words.json");

function stringify(inputArray) {
	var out = "";
	for (var x in inputArray) {
		out += inputArray[x]
		out += " "
	}
	return out
}

process.on('message', (m) => {
  if (m == "shutdown") {
	  process.send("shutting down");
	  process.exit();
  }
});

if(fs.existsSync("./markovdata/messages.json")&&fs.readFileSync("./markovdata/messages.json").toString()!="") {
	
	markov.load("./markovdata/messages.json");
} else {
	markov.save("./markovdata/messages.json");
}

function getUsers() {
  let guilds = client.guilds.cache.array();

  for (let i = 0; i < guilds.length; i++) {
    client.guilds.cache.get(guilds[i].id).members.fetch().then(r => {
      r.members.array().forEach(r => {
        let username = `${r.user.username}#${r.user.discriminator}`;
        // console.log(`${username}`);
      });
    });
  }
}



//Regular execution
setInterval(function(){tick()}, 1000);
setInterval(function(){markov.save("./markovdata/messages.json");console.log("saved")}, 10000)

// commandHandler.commands["ping"].execute();

client.on("ready", () => {
	
	process.send("online");
	
	
});


client.on("message", (message) => {
	if(message.author.id == "601089040107831331" && message.content.startsWith("Successfully set")) {
		guilds[message.guild.id].loadSettings();
	}
	
	if(!message.author.bot) {
		//check if guild is known
		if(guilds[message.guild.id]==undefined) {
			guilds[message.guild.id] = new Guild(message.guild.id);
			guilds[message.guild.id].loadSettings();
		}
		
		if(message.content.startsWith(`${guilds[message.guild.id].settings.settings.prefix}help`)) {
			commandHandler.help(message, guilds[message.guild.id]);
		} else if (message.content.startsWith(guilds[message.guild.id].settings.settings.prefix + "reproduce")) {
			commandHandler.handler(message, guilds[message.guild.id], markov);
		
		} else if(message.content.startsWith(guilds[message.guild.id].settings.settings.prefix)) {
			commandHandler.handler(message, guilds[message.guild.id], client);
		}
		var user = new User(message.author.id);
		user.updateStatistics(2, 1);
		user.saveStatistics();
		
		
		
	}
	
	
	
	
	
	
	if(message.author.id==601089040107831331&&message.content=="Pinging...") {
		var prevCommand = message.channel.messages.cache.array()[message.channel.messages.cache.array().length-2]
		if(prevCommand.content.endsWith("ping")) {
			var time = prevCommand.createdTimestamp;
			message.channel.messages.fetch({around: message.id, limit: 1})
				.then(msg => {
					const fetchedMsg = msg.first();
					fetchedMsg.edit(`Ping:\n${message.createdTimestamp-time}ms`);
				});
		}
	}
	
});




function tick() {
	for(guild in mutes.guilds) {
		console.log(guild)
	}
	process.send("heartbeat");
}

client.login(config.token);