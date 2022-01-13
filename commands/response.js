const fs = require("fs")
const Guild = require("../util/guilds.js");

function idToRole(roleId) {
  return roleId?`<@&${roleId}>`:"None"
}
function idToChannel(channelId) {
  return channelId?`<#${channelId}>`:"None"
}
module.exports = {
  name: "response",
  description: "Change the chance of the bot to respond on a per channel basis",
  help: "Usage: <pre>response <Channel Mention> <value>",
  category: "Admin",
  execute(message, args, client) {
	  // console.log("guild", message.guild.id)
	  // console.log("channel", message.channel.id)
	if (message.channel.type == "dm") {
		message.channel.send("If you dont want me to reply just stop texting me");
	} else {
		var member = client.guilds.cache.find(u => u.id === message.guild.id).members.cache.find(u => u.id === message.author.id);
		if(member.hasPermission(["ADMINISTRATOR"])) {
			if (args.length == 3) {
				var channelId;
				if (args[1].match(/<#[0-9]{18}>/g)) {
					channelId = args[1].replace(/<#|>/g, "");
				} else {
					message.channel.send(`Invalid argument: ${args[1]}`);
					return
				}
				var chance;
				if (!isNaN(parseFloat(args[2]))) {
					chance = Math.max(Math.min(parseFloat(args[2]), 1), 0);
				} else {
					message.channel.send(`Invalid argument: ${args[2]}`);
					return
				}
				
				var guild = new Guild(message.guild.id);
				guild.loadSettings();
				// console.log("repch", guild.settings.settings.response_chance);
				// console.log("guildobj", guild.id)
				
				// console.log("repch", guild.settings.settings.response_chance);
				guild.settings.settings.response_chance[channelId] = chance;
				if (guild.settings.settings.response_chance[channelId] == 0) delete guild.settings.settings.response_chance[channelId];
				guild.saveSettings();
				message.channel.send(`Successfully set the chance for <#${channelId}> to ${chance}.`);
				
			} else if (args.length == 2) {
				if (args[1] == "all") {
					var guild = new Guild(message.guild.id);
					guild.loadSettings();
					
					let out = "The response chances are:\n";
					
					for (let x in guild.settings.settings.response_chance) {
						let newline = `<#${x}>: ${guild.settings.settings.response_chance[x]}\n`;
						if (out.length + newline.length < 1900) {
							out += newline;
						} else {
							message.channel.send(out);
							out = newline;
						}
					}
					message.channel.send(out);
				} else {
					var channelId;
					if (args[1].match(/<#[0-9]{18}>/g)) {
						channelId = args[1].replace(/<#|>/g, "");
					} else {
						message.channel.send(`Invalid argument: ${args[1]}`);
						return
					}
					
					var guild = new Guild(message.guild.id);
					guild.loadSettings();
					
					message.channel.send(`Response chance for <#${channelId}> is ${guild.settings.settings.response_chance[channelId]||0}`)
				}
			} else {
				message.channel.send("Usage: <pre>response <Channel ID / Mention> <value>");
				return
			}
			if (args.length != 3) {
				
			} else {
				
				
			}
		}
	}
  }
}