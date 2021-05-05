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
			var helptext = "```";
			
			for(var category in this.categories) {
				helptext += `${this.categories[category].toUpperCase()}:\n`
				for(var cmd in this.commands) {
					if(this.commands[cmd].category == this.categories[category]) {
						helptext += `   ${this.commands[cmd].name}: ${this.commands[cmd].description}\n`
					}
				}
			}
			helptext += "```"
			var splithelp = this.utilities.splitter(helptext);
			for(var split in splithelp) {
				message.channel.send(splithelp[split])
			}
			
		} else if(Object.keys(this.commands).includes(subCmd)) {
			message.channel.send(this.commands[subCmd].help.replace("<pre>", guilds.settings.settings.prefix));
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