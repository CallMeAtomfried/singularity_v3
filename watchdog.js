const child = require("child_process");
setInterval(function(){tick()}, 1000);
var heartbeats = {
	markov: 0,
	admin: 0,
	game: 0,
	main: 0,
	user: 0
}
var checkheartbeats = {
	markov: false,
	admin: false,
	game: false,
	main: false ,
	user: false
}

function tick() {
	if (checkheartbeats.markov) {
		heartbeats.markov++;
		if (heartbeats.markov > 30) {
			console.log("Markov timeout!");
		}
	}
	if (checkheartbeats.admin) {
		heartbeats.admin++;
		if (heartbeats.admin > 10) {
			console.log("Admin timeout!");
		}
	}
	if (checkheartbeats.game) {
		heartbeats.game++;
		if (heartbeats.game > 30) {
			console.log("Game timeout!");
		}
	}
	if (checkheartbeats.main) {
		heartbeats.main++;
		if (heartbeats.main > 10) {
			console.log("Main timeout!");
		}
	}
	if (checkheartbeats.user) {
		heartbeats.user++;
		if (heartbeats.user > 30) {
			console.log("User timeout!");
			
		}
	}
}


// Start Markovbot
function callback(err) {
	if (err) throw err;
}
var markovprocess;
var gameprocess;
var mainprocess;
var adminprocess;
var userprocess;

start();
function start() {
	markovprocess = {invoked: false, process: child.fork('./bot_markov.js')};
	gameprocess = {invoked: false, process: child.fork('./game.js')};
	mainprocess = {invoked: false, process: child.fork('./main.js')};
	adminprocess = {invoked: false, process: child.fork('./admin.js')};
	userprocess = {invoked: false, process: child.fork('./user.js')};
	
	
	//Markov listeners
	markovprocess.process.on('error', function(err) {
		if(markovprocess.invoked) return;
		markovprocess.invoked = true;
		callback(err);
	});

	markovprocess.process.on('message', function (message) {
		if (message.target != "watchdog") {
			messagehandle(message);
			console.log("markov:".padEnd(10), message)
		} else {
			switch(message.action) {
				case "heartbeat":
					heartbeats.main = 0;
					break;
				case "return":
					console.log("markov:".padEnd(10), message)
					break;
			}
		}
	});

	markovprocess.process.on('exit', function (code) {
		if (markovprocess.invoked) return;
		invoked = true;
		var err = code === 0 ? null : new Error('exit code ' + code);
		callback(err);
	});

	//Admin listeners 
	adminprocess.process.on('error', function(err) {
		if(adminprocess.invoked) return;
		adminprocess.invoked = true;
		callback(err);
	});

	adminprocess.process.on('message', function (message) {
		if (message.target != "watchdog") {
			messagehandle(message);
			console.log("admin:".padEnd(10), message)
		} else {
			switch(message.action) {
				case "heartbeat":
					heartbeats.main = 0;
					break;
				case "return":
					console.log("admin:".padEnd(10), message)
					break;
			}
		}
		
	});
	
	
	adminprocess.process.on('exit', function (code) {
		if (adminprocess.invoked) return;
		invoked = true;
		var err = code === 0 ? null : new Error('exit code ' + code);
		callback(err);
	});




	//Game listeners 

	gameprocess.process.on('error', function(err) {
		if(gameprocess.invoked) return;
		gameprocess.invoked = true;
		callback(err);
	});
	
	
	gameprocess.process.on('message', function (message) {
		if (message.target != "watchdog") {
			messagehandle(message);
			console.log("game:".padEnd(10), message)
		} else {
			switch(message.action) {
				case "heartbeat":
					heartbeats.main = 0;
					break;
				case "return":
					console.log("game:".padEnd(10), message)
					break;
			}
		}
	});
	
	
	gameprocess.process.on('exit', function (code) {
		if (gameprocess.invoked) return;
		invoked = true;
		var err = code === 0 ? null : new Error('exit code ' + code);
		callback(err);
	});

	//main listeners
	mainprocess.process.on('error', function(err) {
		if(mainprocess.invoked) return;
		mainprocess.invoked = true;
		callback(err);
	});
	
	mainprocess.process.on('message', function (message) {
		if (message.target != "watchdog") {
			messagehandle(message);
			console.log("main:".padEnd(10), message)
		} else {
			switch(message.action) {
				case "heartbeat":
					heartbeats.main = 0;
					break;
				case "return":
					console.log("main:".padEnd(10), message);
					break;
			}
		}
	});
	
	
	mainprocess.process.on('exit', function (code) {
		if (mainprocess.invoked) return;
		mainprocess.invoked = true;
		var err = code === 0 ? null : new Error('exit code ' + code);
		callback(err);
	});



	//Game listeners 

	userprocess.process.on('error', function(err) {
		if(userprocess.invoked) return;
		userprocess.invoked = true;
		callback(err);
	});
	
	userprocess.process.on('message', function (message) {
		if (message.target != "watchdog") {
			messagehandle(message);
			console.log("user:".padEnd(10), message)
		} else {
			switch(message.action) {
				case "heartbeat":
					heartbeats.main = 0;
					break;
				case "return":
					console.log("user:".padEnd(10), message)
					break;
			}
		}
	});
	
	
	userprocess.process.on('exit', function (code) {
		if (userprocess.invoked) return;
		userprocess.invoked = true;
		var err = code === 0 ? null : new Error('exit code ' + code);
		callback(err);
	});
}


function messagehandle(message) {
	switch (message.target) {
		case "watchdog":
		case "main":
			mainprocess.process.send(message);
			break;
		case "markov":
			markovprocess.process.send(message);
			break;
		case "game":
			gameprocess.process.send(message);
			break;
		case "user":
			userprocess.process.send(message);
			break;
		case "admin":
			adminprocess.process.send(message);
			break;
	}
	
}


function restart() {
	
	markovprocess.process.send({"command":"shutdown"});
	gameprocess.process.send({"command":"shutdown"});
	mainprocess.process.send({"command":"shutdown"});
	adminprocess.process.send({"command":"shutdown"});
	userprocess.process.send({"command":"shutdown"});
	 
	heartbeats = {
		markov: 0,
		admin: 0,
		game: 0,
		main: 0,
		user: 0
	}
	checkheartbeats = {
		markov: false,
		admin: false,
		game: false,
		main: false,
		uesr: true
	}
	setTimeout(function(){start()}, 2000);
	
}

function killUser() {
	userprocess.process.send({"command":"shutdown"});
	userprocess = {invoked: false, process: child.fork('./user.js')};
}



// runScript('./bot_markov.js', function (err) {
    // if (err) throw err;
// });

// runScript('./main.js', function (err) {
    // if (err) throw err;
// });
// runScript('./game.js', function (err) {
    // if (err) throw err;
// });
// runScript('./admin.js', function (err) {
    // if (err) throw err;
// });