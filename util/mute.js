const fs = require("fs");
module.exports = class Mute {
	mutes = {guilds:{}}
	id = 0;
	
	constructor(guildID) {
		this.id = guildID;
		this.loadMutes();
	}
	
	loadMutes() {
		//If setting file does not exist, create it
		try {
		  if (fs.existsSync(`./data/mutes.json`)) {
			this.mutes = JSON.parse(fs.readFileSync(`./data/mutes.json`).toString());
		  } else {
			this.initialiseMutes(this.id);
		  }
		} catch(err) {
		  console.error(err)
		}
	}
	
	initialiseMutes(){
		console.log(this.id);
		this.mutes = JSON.parse("{guilds:{}}");
		this.saveMutes();
	}
	
	saveMutes() {
		fs.writeFile(`./data/mutes.json`, JSON.stringify(this.mutes), function(){console.log('done')});
	}
	
	mute(guild, user, time) {
		
	}
	
}