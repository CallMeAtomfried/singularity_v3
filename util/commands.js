module.exports = class CommandHandler {
	fs = require("fs");
	commands = {};
	Util = require("./utility.js");
	utilities = new this.Util();
	categories = ["Admin", "Fun", "Markov", "Member", "Moderation", "Utility"]
	
	constructor() {
		this.reload();
	}
	
	reload() {
		
		var categories = this.utilities.getDirectories("./commands");
		
		//Load Commands into dictionary
		var commandFiles = this.fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
		
		for(var cmd in commandFiles){
			this.commands[commandFiles[cmd].replace(".js","")] = eval(this.fs.readFileSync(`./commands/${commandFiles[cmd]}`).toString());
			// console.log(cmd, "Loaded Command: ",commandFiles[cmd]);
		}
		
	}	
	
	help(message, guilds) {
		
		
		var subCmd = message.content.split(" ")[1]
		
		if(subCmd == undefined) {
			var helptext = {}
			
			for(var x in this.commands) {
				if(helptext[this.commands[x].category] == undefined) {
					helptext[this.commands[x].category] = ""
				}
				helptext[this.commands[x].category] += `**${this.commands[x].name}:** \`${this.commands[x].description}\n\``
				
			}
			// for(let x in helptext) {
				// helptext[x] += "```"
			// }
			message.channel.send({
			  "embed": {
				"color": 6365596,
				"author": {
				  "name": "Here to help.",
				  "url": "https://discordapp.com",
				  "icon_url": "https://images.discordapp.net/avatars/601089040107831331/f96cfb6a30ba7b0ce8a4272d43c4073b.png?size=1024"
				},
				"fields": [
				  {
					"name": "👑 Admin",
					"value": helptext.Admin
				  },
				  {
					"name": "👮 Moderation",
					"value": helptext.Moderation
				  },
				  {
					"name": "🛠️ Utilities",
					"value": helptext.Utility
				  },
				  {
					"name": "🎉 Fun",
					"value": helptext.Fun
				  },
				  {
					"name": "📋 Markov",
					"value": helptext.Markov
				  },
				  {
					"name": "💰 Economy",
					"value": helptext.Economy
				  }
				]
			  }
			})
			
		} else if(Object.keys(this.commands).includes(subCmd)) {
			message.channel.send(this.commands[subCmd].help.replace(/<pre>/g, guilds.settings.settings.prefix));
		}
	}

	handler(message, guilds, client) {
		var cmd = message.content.substring(guilds.settings.settings.prefix.length).split(" ")[0];
		if(Object.keys(this.commands).includes(cmd)) {
			this.commands[cmd].execute(message, message.content.split(" "), client);
		} else {
			message.channel.send(`Unknown command. Write ${guilds.settings.settings.prefix}help for help`);
		}
	}
	
}
