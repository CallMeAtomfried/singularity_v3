const fs = require("fs");
module.exports = class Game {
	
	playerID = 0;
	gameID = 0;
	masterMindSeq = [0, 0, 0, 0]
	mastermindEmotes = ["🔴","🔵","🟤","🟣","🟢","🟡","🟠"]
	checkmarks = ["☑","✅","❌"];
	currentTurn = 0;
	score = 0;
	correctlyPlaced = [false,false,false,false];
	// mastermindEmotes = ["1","2","3","4","5","6","7"]
	constructor(player, game, message) {
		this.playerID = player;
		this.gameID = 1;
		this.mastermindStart(message);
	}
	//\:red_circle: \:blue_circle:\:brown_circle:\:purple_circle:\:green_circle:\:yellow_circle:\:orange_circle:
	mastermindStart(message) {
		console.log("Game start");
		for(var x in this.masterMindSeq) {
			var add = this.mastermindEmotes[this.randomInt(0, 7)];
			this.masterMindSeq[x] = add
		}
	}
	
	
	
	nextMove(message) {
		if(this.currentTurn<10) {
			// Cleaning up input
			var input = message.content.replace(/ /g,"");
			
			// Validating input
			var newIn = []
			var validInput = false;
			if(input.length == 8) {
				newIn = [input[0]+input[1],input[2]+input[3],input[4]+input[5],input[6]+input[7]]
				// pls disregard, checking pairs of chars bc thats what the circles are
				validInput = this.mastermindEmotes.includes(input[0]+input[1]) && this.mastermindEmotes.includes(input[2]+input[3]) && this.mastermindEmotes.includes(input[4]+input[5]) && this.mastermindEmotes.includes(input[6]+input[7])
			}
			var out = ""
			if(validInput) {
				// for every circle in input
				for(var x in newIn) {
					if(this.masterMindSeq[x] == newIn[x]) {
						out += this.checkmarks[1];
						if(!this.correctlyPlaced[x]) {
							this.score += (10-this.currentTurn)*10;
							this.correctlyPlaced[x] = true;
						}
					} else if(this.masterMindSeq[x] != newIn[x] && this.masterMindSeq.includes(newIn[x])) {
						out += this.checkmarks[0];
						// this.score += (10-this.currentTurn)*5;
					} else {
						this.score -= (5*this.currentTurn);
						out += this.checkmarks[2];
					}
				}
				this.currentTurn++;
				message.channel.send(`Turn ${this.currentTurn}: ${out}, score: ${this.score}`);
				if(out == "✅✅✅✅") {
					message.reply("You're winner! Score: " + this.score);
					this.currentTurn = 11;
				}
				
			}
		} else {
			message.reply("You lose :c")
		}
	}
	
	randomInt(min, max) {
		return Math.floor(Math.random()*(max - min)) + min
	}
	
}