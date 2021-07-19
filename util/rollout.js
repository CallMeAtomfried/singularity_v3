const fs = require("fs");

module.exports = class Rollout {
	guilds = {}
	
	constructor(guildMap) {
		this.guilds = guildMap;
	}
	
	rolloutSettings(){
		let settingsTemplate = JSON.parse(fs.readFileSync(`./util/template/guildsettings.json`).toString());
		
		for(var x in this.guilds) {
			console.log(this.guilds[x].id, ":");
			let templateKeys = Object.keys(settingsTemplate);
			let guildKeys = Object.keys(this.guilds[x].settings);
			
			for(var y in templateKeys) {
				console.log("	TP Key:", templateKeys[y]);
				if(!guildKeys.includes(templateKeys[y])) {
					console.log("			NOT IN");
					this.guilds[x].settings[templateKeys[y]] = {};
				}
				
				let guildSubKeys = Object.keys(this.guilds[x].settings[templateKeys[y]]);
				let templateSubKeys = Object.keys(settingsTemplate[templateKeys[y]]);
				
				for(var z in templateSubKeys) {
					console.log("		TPS Key:", templateSubKeys[z]);
					if(!guildSubKeys.includes(templateSubKeys[z])) {
						console.log("			NOT IN");
						this.guilds[x].settings[templateKeys[y]][templateSubKeys[z]] = settingsTemplate[templateKeys[y]][templateSubKeys[z]];
					}
				}
			}
			this.guilds[x].saveSettings();
		}
		
	}
	
}