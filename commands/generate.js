
module.exports = {
	name: "generate",
	description: "Generate a markov generated sentence",
	help: "Usage: <pre>generate (text)",
	category: "Markov",
	execute(message, args) {
		if (message.channel.type == "dm") {
			process.send({
				target: "markov",
				action: "command",
				command: "reproduce",
				data: {
					text: message.content,
					guild:null,
					channel: message.author.id,
					dm: true
				}
			});
		} else {
			process.send({
				target: "markov",
				action: "command",
				command: "reproduce",
				data: {
					text: message.content,
					guild: message.guild.id,
					channel: message.channel.id
				}
			});
		}
	}
	
}