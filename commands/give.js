module.exports = {
	name: "give",
	description: "Send a user money",
	help: "Usage: <pre>give <amount>",
	category: "Economy",
	execute(message, args) {
		var recipient;
		if (args[1] != undefined) {
			if (args[1].match(/<@!?[0-9]{18}>/g)) {
				recipient = message.mentions.users.first();//args[1].replace(/<@!?|>/g, "");
				
				if (!isNaN(parseFloat(args[2]))) {
					var messageData = {
						"command": "givemoney",
						"sender": {
							"id": message.author.id,
							"username": message.author.username,
							"discriminator": message.author.discriminator
						},
						"recipient": {
							"id": recipient.id,
							"username": recipient.username,
							"discriminator": recipient.discriminator
						},
						"amount": Math.round(parseFloat(args[2]) * 100),
						"channel": message.channel.id
					}
					console.log(messageData)
					process.send(messageData)
					return
				}
			}
		}
		message.channel.send("OH NO!\nSomething went wrong :c");
	}
}