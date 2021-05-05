const fs = require("fs");
module.exports = class User {
	userdb = require("../data/users.json")
	
	stats = {
			  id: 0,
			  stats: {
			    balance: 0,
			    messages: 0,
			    xp: 0
			  }
			}
	
	constructor(id) {
		this.stats.id = id;
		this.loadStatistics();
	}
	
	updateStatistics(balanceAdjustment, xpAdjustment) {
		this.stats.stats.balance += balanceAdjustment;
		this.stats.stats.xp += xpAdjustment;
		this.stats.stats.messages++;
	}
	
	loadStatistics() {
		if(this.userdb[this.stats.id]) {
			this.stats.stats = this.userdb[this.stats.id];
		} else {
			
			this.saveStatistics();
		}
	}
	
	saveStatistics() {
		this.userdb[this.stats.id] = this.stats.stats;
		fs.writeFileSync("./data/users.json", JSON.stringify(this.userdb), function(){});
	}
	/*
	DATABASE
	id: {
		balance: 0,
		messages: 0,
		xp: 0
	}
	*/
	
}