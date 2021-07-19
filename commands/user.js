var globalAdmins = ["354275704457789451", "586547885320175629"]
module.exports = {
	name: "user",
	description: "Edit a users stats",
	help: "Usage: <pre>user (userping) (stat) (value)",
	category: "Admin",
	execute(message, args) {
		//message.guild.members.cache.get(message.author.id).hasPermission('ADMINISTRATOR')
		if(globalAdmins.includes(message.author.id)) {
			if (args.length == 4) {
				if (args[1].match(/^(<@!?)?[0-9]{18}>?$/g) && !isNaN(parseFloat(args[3]))) {
					args[1] = args[1].replace(/^(<@!?)?|>?$/g, "");
					
					if (!args[1].match(/[^0-9<@!>]*/g)) {
						arg[1] = args[1].replace(/<@!?|>/g, "");
						switch (args[2]) {
							case "xp":
								process.send({"command": "setxp", "user": args[1], "amount": parseInt(args[3])});
								break;
							case "balance":
								process.send({"command": "setbalance", "user": args[1], "amount": args[3]});
								break;
						}
						
						message.channel.send(
						{
						  "embed": {
							"title": `Changed args[1]'s ${args[2]} to ${args[3]}!`,
							"color": 5904774,
							"footer": {
							  "icon_url": `https://images.discordapp.net/avatars/${message.author.id}/${message.author.avatar}.png?size=1024`,
							  "text": `Requested by ${message.author.username}#${message.author.discriminator}`
							},
							"author": {
							  "name": `Success!`,
							  "icon_url": `https://images-ext-1.discordapp.net/external/aPMYC_AVv_dI-VO11_P4AyeO4chC4_bnzVZckRXfYBk/%3Fsize%3D1024/https/images.discordapp.net/avatars/601089040107831331/55b54009409e363d8fa0cbd5db36f6a9.png?width=676&height=676`
							}
						  }
						});
						return
						
					}
				}
			}
		} else { 
			message.channel.send(
			{
			  "embed": {
				"title": `You do not have permission to do that :c`,
				"color": 5904774,
				"footer": {
				  "icon_url": `https://images.discordapp.net/avatars/${message.author.id}/${message.author.avatar}.png?size=1024`,
				  "text": `Requested by ${message.author.username}#${message.author.discriminator}`
				},
				"author": {
				  "name": `Ohno!`,
				  "icon_url": `https://images-ext-1.discordapp.net/external/aPMYC_AVv_dI-VO11_P4AyeO4chC4_bnzVZckRXfYBk/%3Fsize%3D1024/https/images.discordapp.net/avatars/601089040107831331/55b54009409e363d8fa0cbd5db36f6a9.png?width=676&height=676`
				}
			  }
			});
			return
			
		}
		
		message.channel.send({
			  "embed": {
				"title": `Invalid Arguments!`,
				"color": 5904774,
				"description": "Usage: user (userping) (stat) (value)",
				"footer": {
				  "icon_url": `https://images.discordapp.net/avatars/${message.author.id}/${message.author.avatar}.png?size=1024`,
				  "text": `Requested by ${message.author.username}#${message.author.discriminator}`
				},
				"author": {
				  "name": `Ohno!`,
				  "icon_url": `https://images-ext-1.discordapp.net/external/aPMYC_AVv_dI-VO11_P4AyeO4chC4_bnzVZckRXfYBk/%3Fsize%3D1024/https/images.discordapp.net/avatars/601089040107831331/55b54009409e363d8fa0cbd5db36f6a9.png?width=676&height=676`
				}
			  }
			});
	}
}