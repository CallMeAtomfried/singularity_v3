module.exports = {
	name: "ping",
	description: "Test if the bot is responding",
	help: "Usage: <pre>ping",
	category: "Utility",
	execute(message, args) {
		message.channel.send("Pinging...");
		
		
		
	}
	
}