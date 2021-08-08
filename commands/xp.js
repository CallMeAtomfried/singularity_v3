
module.exports = {
	name: "xp",
	description: "View a users or your own XP",
	help: "Usage: <pre>xp (userping)",
	category: "Utility",
	execute(message, args) {
		
		var username = "";
		var userDiscriminator = "";
		var userAvatar = "";
		var userID = "";
		
		if(message.mentions.users.first()) {
			username = message.mentions.users.first().username;
			userDiscriminator = message.mentions.users.first().discriminator;
			userAvatar = message.mentions.users.first().avatar;
			userID = message.mentions.users.first().id;
		} else {
			username = message.author.username;
			userDiscriminator = message.author.discriminator;
			userAvatar = message.author.avatar;
			userID = message.author.id;
		}
		var messageData = {}
		
		if (message.channel.type == "dm") {
			let messageData = {
				target: "user",
				action: "command",
				"command": "getxp",
				data: {
					"channel": message.author.id,
					"target": {
						"username": username,
						"discriminator": userDiscriminator,
						"avatar": userAvatar,
						"id": userID,
					},
					"requester": {
						"id": message.author.id,
						"username": message.author.username,
						"discriminator": message.author.discriminator,
						"avatar": message.author.avatar
					},
					dm: true
				}
			}
		} else {
			let messageData = {
				target: "user",
				action: "command",
				"command": "getxp",
				data: {
					"channel": message.channel.id,
					"target": {
						"username": username,
						"discriminator": userDiscriminator,
						"avatar": userAvatar,
						"id": userID,
					},
					"requester": {
						"id": message.author.id,
						"username": message.author.username,
						"discriminator": message.author.discriminator,
						"avatar": message.author.avatar
					}
				}
			}
		}
		process.send(messageData)
	}
}