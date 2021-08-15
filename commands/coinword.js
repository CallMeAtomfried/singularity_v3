module.exports = {
	name: "coinword",
	description: "Generates new words",
	help: "Usage: <pre>coinword [Args]\nArguments are optional. Each argument will be used to seed a new word.",
	category: "Markov",
	execute(message, args) {
		var seeds = [];
		if (args.length == 1) {
			seeds = ["\n"]
		} else {
			for (var i = 1; i < args.length; i++) {
				seeds[i-1] = args[i]
			}
		}
		if (seeds.length > 20) {
			message.channel.send("Too many seeds");
			return
		}
		
		if (message.channel.type == "dm") {
			var channel = message.author.id
		} else {
			var channel = message.channel.id
		}
		
		process.send({target: "markov", action: "command", "command":"coinword", data: {"array":seeds, "channel":channel, dm: message.channel.type == "dm"}});
		
	}
	
}