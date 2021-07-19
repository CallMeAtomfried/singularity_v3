
module.exports = {
	name: "balance",
	description: "View a users or your own balance",
	help: "Usage: <pre>balance (userping)",
	category: "Economy",
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
		
		let messageData = {
			"command": "getbalance",
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
		
		process.send(messageData);
	}
}