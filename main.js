const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs")
const config = require("./config.json");
var mutes = require("./data/mutes.json");

const Mute = require("./util/mute.js");
const Command = require("./util/commands.js");
const Guild = require("./util/guilds.js");
const Markov = require("./util/markov.js");
const User = require("./util/user.js");

var guilds = {};
var commandHandler = new Command();
var markov = new Markov();


//GAME CHILD PROCESS
const child = require("child_process");
function runScript(scriptPath, callback) {

    // keep track of whether callback has been invoked to prevent multiple invocations
    var invoked = false;

    var process = child.fork(scriptPath);

    // listen for errors as they may prevent the exit event from firing
    process.on('error', function (err) {
        if (invoked) return;
        invoked = true;
        callback(err);
    });

    // execute the callback once the process has finished running
    process.on('exit', function (code) {
        if (invoked) return;
        invoked = true;
        var err = code === 0 ? null : new Error('exit code ' + code);
        callback(err);
    });

}

runScript('./game.js', function (err) {
    if (err) throw err;
    console.log('Mastermind process exited');
});
//END OF GAME CHILD PROCESS SHIT

if(fs.existsSync("./markovdata/messages.json")&&fs.readFileSync("./markovdata/messages.json").toString()!="") {
	
	markov.load("./markovdata/messages.json");
} else {
	markov.save("./markovdata/messages.json");
}

function getUsers() {
  let guilds = client.guilds.array();

  for (let i = 0; i < guilds.length; i++) {
    client.guilds.get(guilds[i].id).fetchMembers().then(r => {
      r.members.array().forEach(r => {
        let username = `${r.user.username}#${r.user.discriminator}`;
        // console.log(`${username}`);
      });
    });
  }
}



//Regular execution
setInterval(function(){tick()}, 1000);
setInterval(function(){markov.save("./markovdata/messages.json");console.log("saved")}, 10000)

// commandHandler.commands["ping"].execute();

client.on("ready", () => {
	console.log("I am ready!");
	getUsers();
	
});


client.on("message", (message) => {
	if(message.author.id == "601089040107831331" && message.content.startsWith("Successfully set")) {
		guilds[message.guild.id].loadSettings();
	}
	if(!message.author.bot) {
		//check if guild is known
		if(guilds[message.guild.id]==undefined) {
			guilds[message.guild.id] = new Guild(message.guild.id);
			guilds[message.guild.id].loadSettings();
		}
		
		if(message.content.startsWith(`${guilds[message.guild.id].settings.settings.prefix}help`)) {
			commandHandler.help(message, guilds[message.guild.id]);
		} else if(message.content.startsWith(guilds[message.guild.id].settings.settings.prefix)) {
			commandHandler.handler(message, guilds[message.guild.id], client);
		}
		var user = new User(message.author.id);
		user.updateStatistics(2, 1);
		user.saveStatistics();
		
		
		
	}
	
	
	
	
	//Global admin only stuff
	var globalAdmins = ["354275704457789451"]
	
	if(globalAdmins.includes(message.author.id) && message.content.startsWith("--")) {
		globalAdmin(message);
	}
	
	
	if(message.author.id==601089040107831331&&message.content=="Pinging...") {
		var prevCommand = message.channel.messages.array()[message.channel.messages.array().length-2]
		if(prevCommand.content.endsWith("ping")) {
			var time = prevCommand.createdTimestamp;
			message.channel.fetchMessages({around: message.id, limit: 1})
				.then(msg => {
					const fetchedMsg = msg.first();
					fetchedMsg.edit(`Ping:\n${message.createdTimestamp-time}ms`);
				});
		}
	}
	
	//Markov learning
	if(message.author.id!=601089040107831331 && !config.blacklistguilds.includes(message.guild.id) && !message.content.startsWith("--") && guilds[message.guild.id].settings.settings.learn) {
		markov.learn(message.content, 6);
		markov.learn(message.content, 5);
		markov.learn(message.content, 4);
		markov.learn(message.content, 3);
		markov.learn(message.content, 2);
		markov.learn(message.content, 1);
		console.log("Learned");
	}
});



function globalAdmin(message) {
	//Roll out updates to guilds
	if(message.content=="--rollout") {
		let Update = require("./util/rollout.js");
		let rollout = new Update(guilds);
		rollout.rolloutSettings();
	} else if(message.content.startsWith("--blacklist add")) {
		let guildToBL = message.content.replace("--blacklist add ","");
		if(!config.blacklistguilds.includes(guildToBL)) {
			config.blacklistguilds.push(guildToBL);
			fs.writeFile("config.json", JSON.stringify(config), function(){});
		}
		console.log(config.blacklistguilds)
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

function tick() {
	for(guild in mutes.guilds) {
		console.log(guild)
	}
}

client.login(config.token);