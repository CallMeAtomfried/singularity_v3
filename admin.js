// Admin process
process.send({target: "watchdog", action: "return","return": "starting"})
const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const Guild = require("./util/guilds.js");
const Update = require("./util/rollout.js");
setInterval(function(){tick()}, 10000);
var globalAdmins = ["354275704457789451", "586547885320175629"]

function tick() {
	process.send({target: "watchdog", action: "heartbeat"});
}

client.on("message", (message) => {
	if(globalAdmins.includes(message.author.id) && message.content.startsWith("--")) {
		globalAdmin(message);
	}
});

client.on("ready", () => {
	process.send({target: "watchdog", action: "return", "return":"online"});
});



process.on('message', (m) => {
	if (m.action == "command") {
		switch (m.command) {
			case "shutdown":
				process.send({target: "watchdog", action: "return", "return":"shutting down"});
				process.exit();
				break;
		}
	}

});

function globalAdmin(message) {
	//Roll out updates to guilds
	if(message.content=="--rollout") {
		var guildIds = client.guilds.cache.map(guild => guild.id);
		console.log("guild ids:", guildIds);
		var guilds = {};
		for (var x in guildIds) {
			guilds[x] = new Guild(guildIds[x]);
			guilds[x].loadSettings();
			console.log(guilds[x].id);
		}
		
		let rollout = new Update(guilds);
		rollout.rolloutSettings();
	} else if(message.content.startsWith("--blacklist add")) {
		let guildToBL = message.content.replace("--blacklist add ","");
		if(!config.blacklistguilds.includes(guildToBL)) {
			config.blacklistguilds.push(guildToBL);
			fs.writeFile("config.json", JSON.stringify(config), function(){});
		}
		// console.log(config.blacklistguilds)
	} else if(message.content.startsWith("--blacklist remove")) {
		let guildToBL = message.content.replace("--blacklist remove ","");
		if(config.blacklistguilds.includes(guildToBL)) {
			let guildIndex = config.blacklistguilds.indexOf(guildToBL);
			config.blacklistguilds.splice(guildIndex, 1);;
			fs.writeFile("config.json", JSON.stringify(config), function(){});
		}
	} else if(message.content == ("--blacklist")) {
		var blacklistGuilds = "";
		for(var guild in config.blacklistguilds) {
			try{
				blacklistGuilds += `${client.guilds.get(config.blacklistguilds[guild]).name}\n`
			} catch {
				;
			}
			
		}
		message.channel.send(blacklistGuilds || "No guilds blacklisted!");
	} else if(message.content == "--systeminfo") {
		message.channel.send(systeminfo());
	} else if(message.content.startsWith("--eval ")) {
		try {
			message.channel.send(evaluate(message.content.replace("--eval ", ""), message) || "OK!");
		} catch {
			message.channel.send("Could not evaluate!");
		}
	} else if (message.content == "--reload") {
		process.send({target: "main", action: "command", "command": "reload"});
	} else if (message.content == "--restart") {
		process.send({target: "watchdog", action: "command", "command": "restart"});
	} else if (message.content == "--invite") {
		message.channel.send("https://discord.com/oauth2/authorize?client_id=601089040107831331&scope=bot&permissions=67398656")
	} 
}
function systeminfo() {
	const os = require("os");
	var cpuOut = "```";
	for(var c = 0; c < os.cpus().length; c++) {
		cpuOut += `CPU${c}: Speed: ${os.cpus()[c].speed}MHz\n`
	}
	var total = 0;
	cpuOut += "\nProcess Memory usage:\n";
	for(var m in process.memoryUsage()) {
		cpuOut += `${m}: ${Math.round(process.memoryUsage()[m] / 1000)}kB\n`
		total += process.memoryUsage()[m];
	}
	cpuOut += `Total: ${total/1000}kB\n\nSystem Memory usage: ${Math.round(((os.totalmem-os.freemem)/os.totalmem)*10000)/100}% (${Math.round(os.freemem/1000/1000)}MB/${Math.round(os.totalmem/1000/1000)}MB)`
	return cpuOut + "```";
}
function evaluate(input, message) {
	return eval(input);
}


client.login(config.token);