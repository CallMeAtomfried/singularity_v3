const fs = require("fs")
module.exports = {
	name: "settings",
	description: "Change the server settings",
	help: "Usage: <pre>settings <setting> <value>\n or: <pre>setting help",
	category: "Admin",
	execute(message, args, client) {
		// args = message.content.substring(message.content.split(" ")[0].length).trim().split(" ");
		
		//Get Message author as MEMBER!
		var member = client.guilds.find(u => u.id === message.guild.id).members.find(u => u.id === message.author.id);
		if(member.hasPermission(["ADMINISTRATOR"])) {
			if(args[1] == undefined) {
				let settingsTemplate = JSON.parse(fs.readFileSync(`./guilds/${message.guild.id}/settings.json`).toString()).settings;
				let dummy = JSON.parse(fs.readFileSync(`./guilds/${message.guild.id}/settings.json`).toString()).dummy;
				let settingsNames = ""
					
				var subkey = Object.keys(settingsTemplate)
				
				for(var y in subkey) {
					settingsNames += (`${subkey[y]}: ${dummy[subkey[y]]}\n`)
					
				}
				
				message.channel.send({
				  "embed": {
					"title": "Guild Settings",
					"description": `**The available guild settings are**\n\n${settingsNames}`,
					"color": 5380730
				  }
				})
									
			} else {
				let dummy = JSON.parse(fs.readFileSync(`./guilds/${message.guild.id}/settings.json`).toString()).dummy;
				if(Object.keys(dummy).includes(args[1])) {
					switch (dummy[args[1]]) {
						case "Role ID":
							//Check if args[2] is roleID
							break
						case "Channel ID": 
							console.log("channel");
							break
						case "String":
							console.log("prefix");
							break
						default:
							console.log("other");
					}
				}
			}
		}
	}
}