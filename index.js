const http = require('http')
const port = process.env.PORT || 8080
http.createServer().listen(port)

const express = require('express');
const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});

setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

const emptyField = [
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0]
]
let currentGame = emptyField.map((arrEl) => arrEl.slice())
let fieldString = '' // text message-friendly representation of current game field
let isGameOn = false
let isRedTurn = true
let red, blue // objects containing users of given tile color

const Discord = require('discord.js');
const client = new Discord.Client();

const populateFieldString = () => {
	fieldString = ''
	fieldString = fieldString.concat(':one: :two: :three: :four: :five: :six: :seven:\n')

	for(let i = 0; i <= 5; i++) {
		for(let j = 0; j <= 6; j++) {
			switch(currentGame[i][j]) {
				case 0: // no circle
					fieldString = fieldString.concat(':white_circle: ')
					break
				
				case 1: // red circle
					fieldString = fieldString.concat(':red_circle: ')
					break
				
				case 2: // blue circle
					fieldString = fieldString.concat(':blue_circle: ')
					break
			}
		}
		fieldString = fieldString.concat('\n')
	}
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
	messages: if(msg.content === '!cf help') {
		msg.channel.send("Hi! I'm Connec Four bot. With my help, you can, well, play connect four")
		msg.channel.send(`
			Commands:\n
			\`!cf help\` - All info found here\n
			\`!cf start [user]\` - Starts a new game between the one who send a message and mentioned user. During game, only users currently playing can start a new game\n
			\`!cf [1-7]\` - During game, if it's your turn, you can use that command to place disc of your color into selected row
		`)
	}

  else if(/^!cf start/.test(msg.content)) { // GAME INITIALIZATION
		if(!isGameOn || red.id === msg.author.id || blue.id === msg.author.id) {
			msg.channel.send("Initializing the game!");
	
			const rand = Math.floor(Math.random()*2)
			if(rand) {
				red = msg.mentions.users.first()
				blue = msg.author
			} else {
				blue = msg.mentions.users.first()
				red = msg.author
			}
			
			if(!red || !blue) {
				msg.channel.send('select an opponent, you dumbo')
			} else if(red.id === blue.id) {
				msg.channel.send('you cant play with yourself, you dumbo')
			} else {
				msg.channel.send(`A game between ${red.username}(:red_circle:) and ${blue.username}(:blue_circle:)`);
		
				currentGame = emptyField.map((arrEl) => arrEl.slice())
				populateFieldString()
				isGameOn = true
		
				msg.channel.send(fieldString);
				msg.channel.send(`${red.username}! Type \`!cf [1-7]\` to place your :red_circle: disc`);
			}
		} else console.log('game cant be started')
	}

	else if(/^!cf [1-7]$/.test(msg.content)) { // PLACING THE DISC
		if(!isGameOn) {
			msg.channel.send('There\'s no game currently being played. To use that command start a new game')
			break messages
		}
		
		const color = isRedTurn ? 1 : 2
		const column = msg.content[msg.content.length - 1] - 1 // because arrays start at 0
		let falling = 0 // a.k.a. 'row', but do...while gives it falling behaviour
		let fallingFlag = false

		// CHECKING IF USER IS CORRECT
		if(isRedTurn) {
			if(msg.author.id !== red.id) {
				msg.channel.send(`It is ${red.username}'s turn. Let them make a move`)
				break messages
			}
		} else {
			if(msg.author.id !== blue.id) {
				msg.channel.send(`It is ${blue.username}'s turn. Let them make a move`)
				break messages
			}
		}

		// PLACING THE DISC
		falling_block: do {
			if(currentGame[falling][column] !== 0) {
				msg.channel.send('Column full, choose another one')
				break falling_block
			}
			else if(currentGame[falling + 1] === undefined || currentGame[falling + 1][column] !== 0) {
				currentGame[falling][column] = color
				fallingFlag = true
			} else falling++
		} while(falling <= 5 && !fallingFlag)

		// CHECKING FOR MATCH
		let matchesPossible = [false, false, false, false]
		let matchesAcc = [0, 0, 0, 0]	// ↕ ↔ ⤢ ⤡

		if(falling >= 0 && falling <= 2) matchesPossible[0] = true // S match possible
		if(falling >= 3 && falling <= 5) matchesPossible[1] = true // N match possible
		if(column >= 0 && column <= 3) matchesPossible[2] = true // E match possible
		if(column >= 3 && column <= 6) matchesPossible[3] = true // W match possible

		/* #region CHECKING DIRECTIONS */
		// CHECK ↓ S
		if(currentGame[falling+1] != undefined && currentGame[falling][column] === currentGame[falling+1][column]) {
			matchesAcc[0]++
			if(currentGame[falling+2] != undefined && currentGame[falling][column] === currentGame[falling+2][column]) {
				matchesAcc[0]++
				if(currentGame[falling+3] != undefined && currentGame[falling][column] === currentGame[falling+3][column]) {
					matchesAcc[0]++
				}
			}
		}
		// CHECK ↑ N
		if(currentGame[falling-1] != undefined && currentGame[falling][column] === currentGame[falling-1][column]) {
			matchesAcc[0]++
			if(currentGame[falling-2] != undefined && currentGame[falling][column] === currentGame[falling-2][column]) {
				matchesAcc[0]++
				if(currentGame[falling-3] != undefined && currentGame[falling][column] === currentGame[falling-3][column]) {
					matchesAcc[0]++
				}
			}
		}
		// CHECK → E
		if(currentGame[falling][column] === currentGame[falling][column+1]) {
			matchesAcc[1]++
			if(currentGame[falling][column] === currentGame[falling][column+2]) {
				matchesAcc[1]++
				if(currentGame[falling][column] === currentGame[falling][column+3]) {
					matchesAcc[1]++
				}
			}
		}
		// CHECK ← W
		if(currentGame[falling][column] === currentGame[falling][column-1]) {
			matchesAcc[1]++
			if(currentGame[falling][column] === currentGame[falling][column-2]) {
				matchesAcc[1]++
				if(currentGame[falling][column] === currentGame[falling][column-3]) {
					matchesAcc[1]++
				}
			}
		}
		// CHECK ↘ SE
		if(currentGame[falling+1] != undefined && currentGame[falling][column] === currentGame[falling+1][column+1]) {
			matchesAcc[2]++
			if(currentGame[falling+2] != undefined && currentGame[falling][column] === currentGame[falling+2][column+2]) {
				matchesAcc[2]++
				if(currentGame[falling+3] != undefined && currentGame[falling][column] === currentGame[falling+3][column+3]) {
					matchesAcc[2]++
				}
			}
		}
		// CHECK ↙ SW
		if(currentGame[falling+1] != undefined && currentGame[falling][column] === currentGame[falling+1][column-1]) {
			matchesAcc[3]++
			if(currentGame[falling+2] != undefined && currentGame[falling][column] === currentGame[falling+2][column-2]) {
				matchesAcc[3]++
				if(currentGame[falling+3] != undefined && currentGame[falling][column] === currentGame[falling+3][column-3]) {
					matchesAcc[3]++
				}
			}
		}
		// CHECK ↗ NE
		if(currentGame[falling-1] != undefined && currentGame[falling][column] === currentGame[falling-1][column+1]) {
			matchesAcc[3]++
			if(currentGame[falling-2] != undefined && currentGame[falling][column] === currentGame[falling-2][column+2]) {
				matchesAcc[3]++
				if(currentGame[falling-3] != undefined && currentGame[falling][column] === currentGame[falling-3][column+3]) {
					matchesAcc[3]++
				}
			}
		}
		// CHECK ↖ NW
		if(currentGame[falling-1] != undefined && currentGame[falling][column] === currentGame[falling-1][column-1]) {
			matchesAcc[2]++
			if(currentGame[falling-2] != undefined && currentGame[falling][column] === currentGame[falling-2][column-2]) {
				matchesAcc[2]++
				if(currentGame[falling-3] != undefined && currentGame[falling][column] === currentGame[falling-3][column-3]) {
					matchesAcc[2]++
				}
			}
		}
		/* #endregion */

		// PRINGING THE BOARD
		populateFieldString()
		msg.channel.send(fieldString)

		// CONSEQUENCES
		if(matchesAcc.filter(match => match === 3).length > 0) { // if a match
			msg.channel.send(`:tada: Congratulations ${msg.author.username}! You won! :tada:`)
			currentGame = emptyField.map((arrEl) => arrEl.slice())
			isGameOn = false
		} else { // printing instructions for next turn
			isRedTurn = !isRedTurn
			msg.channel.send(`Now it's ${isRedTurn ? red.username : blue.username}'s turn! Type \`!cf [1-7]\` to place your ${isRedTurn ? ':red_circle:' : ':blue_circle:'} disc.`)
		}
	}
})

client.on('error', err => {
	console.log(err)
})

client.login(process.env.TOKEN)