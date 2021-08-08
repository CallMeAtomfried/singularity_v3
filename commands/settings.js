const fs = require("fs")
const Guild = require("../util/guilds.js");

function idToRole(roleId) {
  return roleId?`<@&${roleId}>`:"None"
}
function idToChannel(channelId) {
  return channelId?`<#${channelId}>`:"None"
}

function getSettings(message, args, guild) {
	
	var s = guild.settings.settings;
	var d = guild.settings.dummy;
	var sKeys = Object.keys(s);
	var output = "";
	if (args[2] == "all") {
		
		for (var k in sKeys) {
			output += (`${sKeys[k]}:`).padEnd(20);
			if (d[sKeys[k]] == "Channel ID" && s[sKeys[k]] != "") {
				output += idToChannel(`${s[sKeys[k]]}`.replace("[object Object]", "Use according command").padEnd(24) + "\n");
			} else if (d[sKeys[k]] == "Role ID" && s[sKeys[k]] != "") {
				output += idToRole(`${s[sKeys[k]]}`.replace("[object Object]", "Use according command").padEnd(24) + "\n");
			} else {
				output += (`${s[sKeys[k]]}`.replace("[object Object]", "Use according command").padEnd(24) + "\n");
			}
			
		}
	} else if (sKeys.includes(args[2])) {
		output += (`${args[2]}:`).padEnd(20);
		output += `${s[args[2]]}\n`.replace("[object Object]", "Use according command");
	}
	
	
	
	message.channel.send({
	  "embed": {
		"color": 6365596,
		
		  "description": "The guilds settings are\n\n```" + output + "```",
		"author": {
		  "name": "Here to help.",
		  "url": "https://discordapp.com",
		  "icon_url": "https://images.discordapp.net/avatars/601089040107831331/f96cfb6a30ba7b0ce8a4272d43c4073b.png?size=1024"
		}
	  }
	})
	
}

function resetSettings(message, args, guild) {
	var defaultSettings = {
		learn: "false",
		mute_role: "",
		join_logs: "",
		leave_logs: "",
		message_logs: "",
		mod_logs: "",
		role_permissions: {},
		prefix: "$",
		automod: [],
		response_chance: {}
	}
	
	var keys = Object.keys(defaultSettings);
	
	if (args[3] != "confirm") {								//$settings   reset     setting
		message.channel.send(`Are you sure? To confirm, say "${args[0]} ${args[1]} ${args[2]} confirm"`);
	} else {
		if (keys.includes(args[2])) {
			guild.settings.settings[args[2]] = defaultSettings[args[2]]
			message.channel.send(`Reset setting ${args[2]}`)
			guild.saveSettings();
		} else if (args[2] == "all") {
			for (var k in keys) {
				guild.settings.settings[keys[k]] = defaultSettings[keys[k]]
			}
			message.channel.send(`Reset all settings`)
			guild.saveSettings();
		}
			
	}
	
}

function setSettings(message, args, guild) {
	// $settings set name value
	var s = guild.settings.settings;
	var sKeys = Object.keys(s);
	console.log(sKeys.includes(args[2]));
	var d = guild.settings.dummy;
	var dKeys = Object.keys(s);
	
	
	if (sKeys.includes(args[2])) {
		switch (d[args[2]]) {
			case "all":
			case "((WIP))":
			case "Use command automod":
			case "[object Object]":
				message.channel.send("Cannot do that");
				return
			case "Boolean":
			
				if (args[3] == "true") {
					guild.settings.settings[args[2]] = true;
					guild.saveSettings();
					message.channel.send(`Successfully set ${args[2]} to ${args[3]}`)
				} else if (args[3] == "false") {
					guild.settings.settings[args[2]] = false;
					guild.saveSettings();
					message.channel.send(`Successfully set ${args[2]} to ${args[3]}`)
				} else {
					message.channel.send("Value must be \"true\" or \"false\"");
				}
				
				return
			case "Channel ID":
				if (args[3].match(/<#\d{18}>/)) {
					var channelId = args[3].replace(/.*<#|>.*/g, "");
					guild.settings.settings[args[2]] = channelId;
					guild.saveSettings();
					message.channel.send(`Successfully set ${args[2]} to ${args[3]}`)
				}
				
				return
			case "Role ID":
				if (args[3].match(/<@&\d{18}>/)) {
					var roleId = args[3].replace(/.*<@&|>.*/g, "");
					guild.settings.settings[args[2]] = roleId;
					guild.saveSettings();
					message.channel.send(`Successfully set ${args[2]} to ${args[3]}`)
				}
				return
			case "String":
				console.log("string");
				guild.settings.settings[args[2]] = args[3]
				guild.saveSettings();
				message.channel.send(`Successfully set ${args[2]} to ${args[3]}`)
				return
			
		}
	}
	
}

module.exports = {
	name: "settings",
	description: "Change the bot settings",
	help: "Usage: \n<pre>settings set <setting> <value>\n<pre>settings get <setting / all>\n<pre>settings reset <setting>",
	category: "Admin",
	execute(message, args, client) {
		if (message.channel.type == "dm") {
			message.channel.send("ERROR! Settings are for guilds only!")
		} else {
			var guild = new Guild(message.guild.id);
			guild.loadSettings();
			var s = guild.settings.settings;
			var d = guild.settings.dummy;
			console.log(args);
			var member = client.guilds.cache.find(u => u.id === message.guild.id).members.cache.find(u => u.id === message.author.id);
			if(member.hasPermission(["ADMINISTRATOR"])) {
				
				if (args.length == 2 && args[1] == "help") {
					var dummyKeys = Object.keys(d);
					var output = "";
					for (var k in dummyKeys) {
						output += (`${dummyKeys[k]}:`).padEnd(20);
						output += `${d[dummyKeys[k]]}\n`.replace("[object Object]", "Use command responses");
					}
					message.channel.send({
					  "embed": {
						"color": 6365596,
						
						  "description": "Here are the settings\n\n```" + output + "```",
						"author": {
						  "name": "Here to help.",
						  "url": "https://discordapp.com",
						  "icon_url": "https://images.discordapp.net/avatars/601089040107831331/f96cfb6a30ba7b0ce8a4272d43c4073b.png?size=1024"
						}
					  }
					})
				} else if (args.length >= 3) {
					switch (args[1]) {
						case "get":
							getSettings(message, args, guild)
							return
						case "reset":
							resetSettings(message, args, guild)
							return
						case "set":
							setSettings(message, args, guild)
							return
					}
					
				}
				
			} 
		}
	}
}