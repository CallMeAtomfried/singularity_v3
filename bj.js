// Blackjack JS
class Dealer {
	hand = [];
	value = 0;
	
	getValue() {
		return this.value;
	}
	dealCard(player, cards) {
		player.receiveCards(cards);
	}
	printCards() {
		console.log("HAND", this.hand);
		for (i of this.hand) {
			let outputString = `${names[i % names.length]} of ${symbols[Math.floor(i / 52 * 4)]} (value: ${values[i % values.length]})`
			console.log(outputString);
		}
	}
	receiveCards(cards) {
		this.hand.push(...cards);
		this.value = 0;
		for (let card of this.hand) {
			this.value += values[card % values.length];
		}
	}
}

class Player {
	hand = [];
	value = 0;
	getValue() {
		return this.value;
	}
	receiveCards(cards) {
		console.log("BEEN DEALT:", cards);
		this.hand.push(...cards);
		this.value = 0;
		for (let card of this.hand) {
			this.value += values[card % values.length];
		}
	}
	printCards() {
		console.log("HAND", this.hand);
		for (i of this.hand) {
		let outputString = `${names[i % names.length]} of ${symbols[Math.floor(i / 52 * 4)]} (value: ${values[i % values.length]})`
		console.log(outputString);
	}
	}
}

//add each card 6 times to the deck
let deck = [];
for (let i = 0; i < 52; i++) {
	deck.push(...[i,i,i,i,i,i]);
}

let symbols = ["Hearts", "Diamonds", "Clubs", "Spades"];
let names = [2,3,4,5,6,7,8,9,10,"Jack","Queen","King","Ace"];
let values = [2,3,4,5,6,7,8,9,10,10,10,10,11];


function shuffle(d) {
	let newdeck = [];
	for (let i = 0; i < 52*6; i++) {
		let random = Math.floor(Math.random() * d.length);
		newdeck.push(d[random]);
		d[random] = undefined;
		d = d.filter(function(x) {
			return x !== undefined;
		});
	}
	return newdeck;
}
deck = shuffle(deck);
// outputDeck(deck);
function outputDeck(d) {
	for (i of deck) {
		let outputString = `${names[i % names.length]} of ${symbols[Math.floor(i / 52 * 4)]} (value: ${values[i % values.length]})`
		console.log(outputString);
	}
}

let player1 = new Player();
let dealer = new Dealer();
let i = 0;
console.log("\n++++++++++++++++++initial p1 cards");
dealer.dealCard(player1, [deck[i], deck[i+1]]);
player1.printCards();
console.log("PLAYER VALUE:", player1.getValue());
	
	
console.log("\n++++++++++++++++++initial dealer cards");
dealer.receiveCards([deck[i+2], deck[i+3]]);
dealer.printCards();
console.log("DEALER VALUE", dealer.getValue());
i = 4;
//Game Loop
console.log("\n+++++++++++++++++gameloop player");
while (player1.getValue() < 21) {
	dealer.dealCard(player1, [deck[i]]);
	player1.printCards();
	console.log("PLAYER VALUE:", player1.getValue());
	i++;
	console.log(player1.getValue()>21?"  BUST!":"");
}
console.log("\n++++++++++++++++++gameloop dealer");
while (dealer.getValue() <= 17) {
	dealer.receiveCards([deck[i]]);
	dealer.printCards();
	console.log("DEALER VALUE:", dealer.getValue());
	i++;
	console.log(dealer.getValue()>21?"  BUST!":"");
}
if (player1.getValue() <= 21 && dealer.getValue() <= 21) {
	if (dealer.getValue() < player1.getValue()) {
		console.log("PLAYER WIN!");
	} else {
		console.log("PLAYER LOSE!");
	}
} else if (player1.getValue() <= 21 && dealer.getValue() > 21) {
	console.log("PLAYER WIN!");
} else {
	console.log("PLAYER LOSE");
}


