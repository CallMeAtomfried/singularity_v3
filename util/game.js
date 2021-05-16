const fs = require("fs");
module.exports = class Game {
	
	playerID = 0;
	gameID = 0;
	masterMindSeq = [0, 0, 0, 0]
	mastermindEmotes = ["🔴","🔵","🟤","🟣","🟢","🟡","🟠"]
	checkmarks = ["☑","✅","❌"];
	currentTurn = 0;
	score = 0;
	// mastermindEmotes = ["1","2","3","4","5","6","7"]
	constructor(player, game, message) {
		this.playerID = player;
		this.gameID = 1;
		this.mastermindStart(message);
	}
	//\:red_circle: \:blue_circle:\:brown_circle:\:purple_circle:\:green_circle:\:yellow_circle:\:orange_circle:
	mastermindStart(message) {
		for(var x in this.masterMindSeq) {
			var add = this.mastermindEmotes[this.randomInt(0, 7)];
			this.masterMindSeq[x] = add
		}
	}
	
	
	
	nextMove(message) {
		if(this.currentTurn<10) {
			var input = message.content.replace(/ /g,"");
			console.log("i", input, input.length);
			var newIn = []
			var validInput = false;
			if(input.length == 8) {
				newIn = [input[0]+input[1],input[2]+input[3],input[4]+input[5],input[6]+input[7]]
				validInput = this.mastermindEmotes.includes(input[0]+input[1]) && this.mastermindEmotes.includes(input[2]+input[3]) && this.mastermindEmotes.includes(input[4]+input[5]) && this.mastermindEmotes.includes(input[6]+input[7])
			}
			var out = ""
			if(validInput) {
				for(var x in newIn) {
					if(this.masterMindSeq[x] == newIn[x]) {
						out += this.checkmarks[1];
						this.score += (10-this.currentTurn)*10;
					} else if(this.masterMindSeq[x] != newIn[x] && this.masterMindSeq.includes(newIn[x])) {
						out += this.checkmarks[0];
						this.score += (10-this.currentTurn)*5;
					} else {
						out += this.checkmarks[2];
					}
				}
				this.currentTurn++;
				message.channel.send(`Turn ${this.currentTurn}: ${out}`);
				if(out == "☑☑☑☑") message.reply("You're winner! Score: " + this.score);
			}
		}
	}
	
	randomInt(min, max) {
		return Math.floor(Math.random()*(max - min)) + min
	}
	
}