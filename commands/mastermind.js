module.exports = {
	name: "mastermind",
	description: "Start a game of mastermind against the bot",
	help: "Usage: <pre>mastermind (rules)",
	category: "Fun",
	execute(message, args) {
		if(args[1]=="rules") {
			message.channel.send({
		  "embed": {
			"title": "Mastermind",
			"description": "Mastermind is a logic based game. The goal is to decypher the secret 4 color code decided by the bot. ",
			"color": 1152950,
			"author": {
			  "name": "Singularity",
			  "icon_url": "https://cdn.discordapp.com/embed/avatars/0.png"
			},
			"fields": [
			  {
				"name": "Starting the game",
				"value": "Start the game by typing >mm"
			  },
			  {
				"name": "Making a guess",
				"value": "You have a total of 10 guesses. To guess, simply send a sequence of exactly 4 of the colored circle emotes. Anything else is ignored as a guess."
			  },
			  {
				"name": "Your results",
				"value": "Once you made the guess, you will see if you have a color in the correct spot marked with ✅, a correct color in the wrong spot marked with ☑ or a color that does not occur in the code marked with ❌"
			  }
			]
		  }
		})
		} else {
			message.channel.send("Make your guess");
		}
		
		
	}
}