const fs = require("fs");
const Mute = eval(fs.readFileSync(`./util/mute.js`).toString());

// const Mute = require("./util/mute.js");
module.exports = {
	name: "mute",
	description: "Mute a user (WIP)",
	help: "Usage: <pre>mute <Userping> <Time>[d/h/m/s]",
	category: "Moderation",
	execute(message, args, client) {
		const multiplyers  = {d: 86400000, h: 360000, m: 60000, s: 1000}
		var mutes = new Mute(message.guild.id);
		var settings = JSON.parse(fs.readFileSync(`./guilds/${message.guild.id}/settings.json`).toString());
		
		//Get Message author as MEMBER!
		var member = client.guilds.find(u => u.id === message.guild.id).members.find(u => u.id === message.author.id);
		
		// Check if mute role is set
		if(settings.settings.mute_role=="") {
			message.reply("No mute role set. Ask the admin");
			
		// Check if message author has mute permission
		} else if(!member.hasPermission(["MUTE_MEMBERS"])) {
			message.reply("You do not have permission to do that!")
			
		} else {
			// Get the target as MEMBER!
			var target = client.guilds.find(u => u.id === message.guild.id).members.find(u => u.id === message.mentions.users.first().id);
			
			if(target.roles.has(settings.settings.mute_role)) {
				//User already muted
			} else {
				//Mute user and set end time in mute module, save afterwards
			}
			
		}
		
		
		
		
		//forEach(guild => console.log(guild.members.find(u => u.id === '354275704457789451').user, "\n///////////////////////////////////////////"));
		
	}
}