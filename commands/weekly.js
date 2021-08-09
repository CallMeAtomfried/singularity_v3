
module.exports = {
	name: "weekly",
	description: "Guess a number every 7 days and win 5'000 ₳",
	help: "Usage: <pre>weekly [Number between 0 and 100]",
	category: "Fun",
	execute(message, args) {
		
		
		if (args.length == 2 && !isNaN(parseInt(args[1]))) {
			var isDM = (message.channel.type == "dm")
			if (isDM) {
				var channel = message.author.id;
			} else {
				var channel = message.channel.id
			}
			
			var guess = parseInt(args[1], 10)
			
			process.send({
				target: "user",
				action: "command",
				command: "weeklyguess",
				data: {
					guess: guess,
					channel: channel,
					user: message.author.id,
					dm: isDM
				}
			})
		} else {
			if (message.channel.type == "dm") {
				message.author.send({
				   "embed": {
					"title": "Missing argument",
					"description": "You must provide a number between 0 and 100 inclusive",
					"color": 3869547,
					"author": {
					  "name": "Ohno :c",
					  "url": "https://discordapp.com",
					  "icon_url": "https://images-ext-1.discordapp.net/external/aPMYC_AVv_dI-VO11_P4AyeO4chC4_bnzVZckRXfYBk/%3Fsize%3D1024/https/images.discordapp.net/avatars/601089040107831331/55b54009409e363d8fa0cbd5db36f6a9.png?width=676&height=676"
					}
				  }
				});
			}
		}
		
		
	}
}


