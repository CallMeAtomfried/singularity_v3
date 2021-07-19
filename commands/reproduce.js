
module.exports = {
	name: "reproduce",
	description: "Generate a markov generated sentence",
	help: "Usage: <pre>reproduce (text)",
	category: "Markov",
	execute(message, args) {
		process.send({command: "reproduce", text: message.content, guild: message.guild.id, channel: message.channel.id});
	}
	
}