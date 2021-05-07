const User = require("../util/user.js");
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
		console.log(message.mentions.users.first());
		if(message.mentions.users.first()) {
			var user = new User(message.mentions.users.first().id);
			username = message.mentions.users.first().username;
			userDiscriminator = message.mentions.users.first().discriminator;
			userAvatar = message.mentions.users.first().avatar;
			userID = message.mentions.users.first().id;
		} else {
			var user = new User(message.author.id);
			username = message.author.username;
			userDiscriminator = message.author.discriminator;
			userAvatar = message.author.avatar;
			userID = message.author.id;
		}
		// user.loadStatistics();
		var bal = (user.stats.stats.balance/100).toString().split(".")
		console.log(bal);
		if(!bal[1]) {
			bal[1] = "00";
		}
		if(bal[1].length == 1) {
			bal[1] += "0"
		}
		
		message.channel.send(
		{
		  "embed": {
			"title": `${bal[0]}.${bal[1]} ₳`,
			"color": 5904774,
			"footer": {
			  "icon_url": `https://images.discordapp.net/avatars/${message.author.id}/${message.author.avatar}.png?size=1024`,
			  "text": `Requested by ${message.author.username}#${message.author.discriminator}`
			},
			"thumbnail": {
			  "url": "https://cdn.discordapp.com/attachments/586057627771994118/836223441870782464/render.png"
			},
			"author": {
			  "name": `${username}#${userDiscriminator}'s Balance`,
			  "icon_url": `https://images.discordapp.net/avatars/${userID}/${userAvatar}.png?size=1024`
			}
		  }
		});
	}
}