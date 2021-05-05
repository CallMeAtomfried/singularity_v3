const fs = require("fs");

module.exports = class Rollout {
	guilds = {}
	
	constructor(guildMap) {
		this.guilds = guildMap;
	}
	
	rolloutSettings(){
		let settingsTemplate = JSON.parse(fs.readFileSync(`./util/template/guildsettings.json`).toString());
		
		for(var x in this.guilds) {
			let templateKeys = Object.keys(settingsTemplate);
			let guildKeys = Object.keys(this.guilds[x].settings);
			
			for(var y in templateKeys) {
				if(!guildKeys.includes(templateKeys[y])) {
					this.guilds[x].settings[templateKeys[y]] = {};
				}
				
				let guildSubKeys = Object.keys(this.guilds[x].settings[templateKeys[y]]);
				let templateSubKeys = Object.keys(settingsTemplate[templateKeys[y]]);
				
				for(var z in templateSubKeys) {
					if(!guildSubKeys.includes(templateSubKeys[z])) {
						this.guilds[x].settings[templateKeys[y]][templateSubKeys[z]] = settingsTemplate[templateKeys[y]][templateSubKeys[z]];
					}
				}
			}
			this.guilds[x].saveSettings();
		}
		
	}
	
}