const child = require("child_process");
setInterval(function(){tick()}, 1000);
var heartbeats = {
	markov: 0,
	admin: 0,
	game: 0,
	main: 0
}
var checkheartbeats = {
	markov: false,
	admin: false,
	game: false,
	main: false 
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
}


// Start Markovbot
function callback(err) {
	if (err) throw err;
}
var markovprocess;
var gameprocess;
var mainprocess;
var adminprocess;
start();
function start() {
	markovprocess = {invoked: false, process: child.fork('./bot_markov.js')};
	gameprocess = {invoked: false, process: child.fork('./game.js')};
	mainprocess = {invoked: false, process: child.fork('./main.js')};
	adminprocess = {invoked: false, process: child.fork('./admin.js')};

	//Markov listeners
	markovprocess.process.on('error', function(err) {
		if(markovprocess.invoked) return;
		markovprocess.invoked = true;
		callback(err);
	});

	markovprocess.process.on('message', function (message) {
		console.log("markov:", message);
		switch(message) {
			case "heartbeat": 
				heartbeats.markov = 0;
				break
			case "online":
				checkheartbeats.markov = true;
				break;
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
		console.log("admin:", message);
		switch(message) {
			case "heartbeat": 
				heartbeats.admin = 0;
				break
			case "online":
				checkheartbeats.admin = true;
				break;
			case "restart":
				restart();
				break;
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
		console.log("game:", message);
		switch(message) {
			case "heartbeat": 
				heartbeats.game = 0;
				break
			case "online":
				checkheartbeats.game = true;
				break;
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
		console.log("main:", message);
		switch(message) {
			case "heartbeat": 
				heartbeats.main = 0;
				break
			case "online":
				checkheartbeats.main = true;
				break;
		}
	});
	mainprocess.process.on('exit', function (code) {
		if (mainprocess.invoked) return;
		invoked = true;
		var err = code === 0 ? null : new Error('exit code ' + code);
		callback(err);
	});
}

function restart() {
	
	markovprocess.process.send("shutdown");
	gameprocess.process.send("shutdown");
	mainprocess.process.send("shutdown");
	adminprocess.process.send("shutdown");
	heartbeats = {
		markov: 0,
		admin: 0,
		game: 0,
		main: 0
	}
	checkheartbeats = {
		markov: false,
		admin: false,
		game: false,
		main: false 
	}
	start();
	
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