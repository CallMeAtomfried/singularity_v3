module.exports = {
	name: "avatar",
	description: "Return a users avatar",
	help: "Usage: <pre>avatar <Userping>\nThe userping is optional, no provided user gives you your own avatar",
	category: "Fun",
	execute(message, args) {
		
		var userID;
		var args = message.content.split(" ");
		var user;
		var requester=message.author;

		if(message.mentions.users.first()==undefined) {
			user=message.author;
			
		} else {
			user=message.mentions.users.first();
		}


		var requesterURL =`https://images.discordapp.net/avatars/${requester.id}/${requester.avatar}.png?size=1024`; 
		var demandedURL = `https://images.discordapp.net/avatars/${user.id}/${user.avatar}.png?size=1024`;


		message.channel.send({
		  "embed": {
			"title": `${user.username}#${user.discriminator}'s avatar`,
			"color": 5177468,
			"timestamp": `${new Date(message.createdTimestamp)}`,
			"footer": {
			  "icon_url": `${requesterURL}`,
			  "text": `Requested by ${message.author.username}#${message.author.discriminator}`
			},
			"image": {
			  "url": `${demandedURL}`
			}
		  }
		});
	}
	
}