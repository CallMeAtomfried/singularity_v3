const child = require("child_process");

//Heartbeat tracking
setInterval(function(){tick()}, 1000);

function callback(err) {
	if (err) throw err;
}

var markov;
var admin;
var user;
var game;
var main;
start();

function tick() {
	if (markov.check) markov.heartbeat++;
	if (main.check) main.heartbeat++;
	if (user.check) user.heartbeat++;
	if (admin.check) admin.heartbeat++;
	if (game.check) game.heartbeat++;

	if (markov.heartbeat < 60) {
		console.log("Markov Timeout");
		shutdownProcess(markov)
		markov = startProcess("./bot_markov.js")
	}
	if (main.heartbeat < 30) {
		console.log("Main Timeout");
		shutdownProcess(main)
		main = startProcess("./main.js")
	}
	if (user.heartbeat < 30) {
		console.log("User Timeout");
		shutdownProcess(user)
		user = startProcess("./user.js")
	}
	if (markov.heartbeat < 20) {
		console.log("Admin Timeout");
		shutdownProcess(admin)
		admin = startProcess("./admin.js")
	}
	if (game.heartbeat < 60) {
		console.log("Game Timeout");
		shutdownProcess(game)
		game = startProcess("./game.js")
	}
	
}

function shutdownProcess(proc) {
	proc.process.send({command: "shutdown"})
}

function startProcess(procName) {
	return {process: child.fork(procName), invoked: false, heartbeat: 0, check: false};
}

function restart(message) {
	// message: {command: "restart"}
		shutdownProcess(markov)
		shutdownProcess(main)
		shutdownProcess(user)
		shutdownProcess(game)
		shutdownProcess(admin)
		start();
}

function start() {
	markov = startProcess("./bot_markov.js")
	main = startProcess("./main.js")
	user = startProcess("./user.js")
	admin = startProcess("./admin.js")
	game = startProcess("./game.js")

	// ERROR HANDLING
	markov.process.on('error', function(err) {
		markov = processerror(markov);
	});

	admin.process.on('error', function(err) {
		admin = processerror(admin);
	});

	user.process.on('error', function(err) {
		user = processerror(user);
	});
	
	main.process.on('error', function(err) {
		main = processerror(main);
	});
	
	game.process.on('error', function(err) {
		game = processerror(game);
	});


	// MESSAGE  HANDLING
	markov.process.on('message', function (message) {
		if (!message.heartbeat) {
			console.log("markov:".padEnd(10), message);
			sendMessageToTarget(message);
		} else {
			admin.check = true
			markov.heartbeat = 0;
		}
	});

	admin.process.on('message', function (message) {
		if (message.heartbeat) {
			admin.check = true;
			admin.heartbeat = 0;
		} else if (message.command == "restart") {
			restart(message);
		} else {
			console.log("admin:".padEnd(10), message);
			sendMessageToTarget(message);

		}
	});

	game.process.on('message', function (message) {
		if (!message.heartbeat) {
			console.log("game:".padEnd(10), message);
			sendMessageToTarget(message);
		} else {
			game.check = true;
			game.heartbeat = 0;
		}
	});

	main.process.on('message', function (message) {
		if (!message.heartbeat) {
			console.log("main:".padEnd(10), message);
			sendMessageToTarget(message);
		} else {
			main.check = true;
			main.heartbeat = 0;
		}
	});

	user.process.on('message', function (message) {
		if (!message.heartbeat) {
			console.log("user:".padEnd(10), message);
			sendMessageToTarget(message);
		} else {
			user.check = true;
			user.heartbeat = 0;
		}
	});

	markov.process.on('exit', function (code) {
		if (markov.invoked) return;
		markov.invoked = true;
		var err = code === 0 ? null : new Error('exit code ' + code);
		callback(err);
	});

	admin.process.on('exit', function (code) {
		if (admin.invoked) return;
		admin.invoked = true;
		var err = code === 0 ? null : new Error('exit code ' + code);
		callback(err);
	});

	user.process.on('exit', function (code) {
		if (user.invoked) return;
		user.invoked = true;
		var err = code === 0 ? null : new Error('exit code ' + code);
		callback(err);
	});

	main.process.on('exit', function (code) {
		if (main.invoked) return;
		main.invoked = true;
		var err = code === 0 ? null : new Error('exit code ' + code);
		callback(err);
	});

	game.process.on('exit', function (code) {
		if (game.invoked) return;
		game.invoked = true;
		var err = code === 0 ? null : new Error('exit code ' + code);
		callback(err);
	});
}

function processerror(proc) {
	if(proc.invoked) return proc;
	proc.invoked = true;
	callback(err);
	return proc

}

function sendMessageToTarget(message) {
	
	switch(message.target) {
		case "markov":
			markov.process.send(message);
			break;
		case "main":
			main.process.send(message);
			break;
		case "user":
			user.process.send(message);
			break;
		case "admin":
			admin.process.send(message);
			break;
		case "game":
			game.process.send(message);
			break;
	}
}
