const User = require("../util/user.js");
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
		var bal = (user.stats.stats.xp);
		var level = Math.floor(Math.log10(0.9 * bal + 1)+ 0.5*Math.sqrt(bal))
		
		message.channel.send(
		{
		  "embed": {
			"title": `${bal}XP\n(Level ${level})`,
			"color": 5904774,
			"footer": {
			  "icon_url": `https://images.discordapp.net/avatars/${message.author.id}/${message.author.avatar}.png?size=1024`,
			  "text": `Requested by ${message.author.username}#${message.author.discriminator}`
			},
			"author": {
			  "name": `${username}#${userDiscriminator}'s XP`,
			  "icon_url": `https://images.discordapp.net/avatars/${userID}/${userAvatar}.png?size=1024`
			}
		  }
		});
	}
}