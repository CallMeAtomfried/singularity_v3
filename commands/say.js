module.exports = {
	name: "say",
	description: "Make the bot say something",
	help: "Usage: <pre>say <Text to say>",
	category: "Fun",
	execute(message, args) {
		var send = message.content.substring(message.content.split(" ")[0].length)||"Missing argument!";
		message.channel.send(send);
	}
	
}