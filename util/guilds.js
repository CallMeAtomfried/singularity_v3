const fs = require("fs");
module.exports = class Guild {
	id = 0;
	settings = {}
	lastTwoMessage = [];
	mutes = {};
	
	constructor(guildID) {
		this.id = guildID;
		
		//Create guild directory if it does not exist
		if (!fs.existsSync(`./guilds/${this.id}/`)) {
			fs.mkdirSync(`./guilds/${this.id}/`);
		} 
	}
	
	loadSettings() {
		//If setting file does not exist, create it
		try {
		  if (fs.existsSync(`./guilds/${this.id}/settings.json`)) {
			this.settings = JSON.parse(fs.readFileSync(`./guilds/${this.id}/settings.json`).toString());
		  } else {
			this.initialiseSettings(this.id);
		  }
		} catch(err) {
		  console.error(err)
		}
	}
	
	initialiseSettings(){
		console.log(this.id);
		this.settings = JSON.parse(fs.readFileSync(`./util/template/guildsettings.json`).toString());
		this.saveSettings();
	}
	
	saveSettings() {
		fs.writeFile(`./guilds/${this.id}/settings.json`, JSON.stringify(this.settings), function(){console.log('done')});
	}
	
	mute(user, time) {
		
	}
	
}