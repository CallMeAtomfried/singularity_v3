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
		if (message.channel.type == "dm") {
			process.send({target: "markov", action: "command", "command":"coinword", data: {"array":seeds, "channel": message.author.id, dm: true}});
		} else {
			process.send({target: "markov", action: "command", "command":"coinword", data: {"array":seeds, "channel": message.channel.id}});
		}
	}
	
}