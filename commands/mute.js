module.exports = {
	name: "mute",
	description: "Mutes a user",
	help: "Usage: <pre>mute <Userping> (Time)\nTime is optional and uses the suffixes m, h and d",
	category: "Moderation",
	execute(message, args) {
		if (message.channel.type == "dm") {
			message.channel.send("Who would you wanna mute here anyway?");
		} else {
			var requester=message.author;
			var user;
			if (args[1].match(/<@[0-9]{18}>|<@![0-9]{18}>/g)) {
				user = args[1].replace(/<@|!|>/g, "");
			} else {
				message.channel.send("No user provided!")
				return;
			}
			
			var timeInt = Infinity;
			
			if (args[2]) {
				timeInt = parseInt(args[2]);
				var timeFac = args[2].replace(timeInt.toString(), "");
				switch (timeFac) {
				case "d":
					timeInt *= 86400000;
					break;
				case "h":
					timeInt *= 360000;
					break;
				case "m":
					timeInt *= 60000;
					break;
				case "s":
				case "":
					timeInt *= 1000;
					break;
				default:
					message.channel.send("Invalid time!")
					return;
				}
				
			}
			
			var muteEnd = Date.now() + timeInt;
			
			process.send({target: "user", action: "command", command: "mute", data: {"user": user, "timeEnd": muteEnd, "channel": message.channel}})
		}
		
	}
	
}