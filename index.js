require('dotenv').config()

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

const Discord = require('discord.js');
const client = new Discord.Client();

populateFieldString = () => {
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
					fieldString = fieldString.concat(':large_blue_circle: ')
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
  if(msg.content === '!cf start') { // GAME INITIALIZATION
		msg.channel.send("Initializing the game!");
		
		currentGame = emptyField
		console.log('currentGame', currentGame)
		console.log('emptyField', emptyField)
		populateFieldString()

		msg.channel.send(fieldString);
		msg.channel.send("Type '!cf red [number]' or '!cf blue [number]' to start!");
	}

	else if(/^!cf (red|blue) [1-7]$/.test(msg.content)) { // PLACING THE DISC
		const color = msg.content.includes('red') ? 1 : 2
		const column = msg.content[msg.content.length - 1] - 1 // because arrays start at 0
		let falling = 0 // a.k.a. 'row', but do...while gives it falling behaviour
		let fallingFlag = false

		// PLACING THE DISC
		falling_block: do {
			if(currentGame[falling][column] !== 0) {
				msg.channel.send('Column full, choose another one')
				break falling_block
			}
			else if(currentGame[falling + 1] === undefined || currentGame[falling + 1][column] !== 0) {
				console.log(emptyField)
				currentGame[falling][column] = color
				console.log(emptyField)
				fallingFlag = true
			} else falling++
		} while(falling <= 5 && !fallingFlag)

		// CHECKING FOR MATCH
		let match = false
		let matches = [false, false, false, false] // S N E W

		// N - f3-5 | E - c0-3 | W - c3-5 | S - f0-2
		if(falling >= 0 && falling <= 2) matches[0] = true // S match
		if(falling >= 3 && falling <= 5) matches[1] = true // N match
		if(column >= 0 && column <= 3) matches[2] = true // E match
		if(column >= 3 && column <= 5) matches[3] = true // W match

		if(matches[0]) { // S match
			if(currentGame[falling][column] === currentGame[falling+1][column] && currentGame[falling][column] === currentGame[falling+2][column] && currentGame[falling][column] === currentGame[falling+3][column] && currentGame[falling][column] === currentGame[falling+4][column]) match = true
		}
		if(matches[1]) { // N match
			if(currentGame[falling][column] === currentGame[falling-1][column] && currentGame[falling][column] === currentGame[falling-2][column] && currentGame[falling][column] === currentGame[falling-3][column] && currentGame[falling][column] === currentGame[falling-4][column]) match = true
		}
		if(matches[2]) { // E match
			if(currentGame[falling][column] === currentGame[falling][column+1] && currentGame[falling][column] === currentGame[falling][column+2] && currentGame[falling][column] === currentGame[falling][column+3] && currentGame[falling][column] === currentGame[falling][column+4]) match = true
		}
		if(matches[3]) { // W match
			if(currentGame[falling][column] === currentGame[falling][column-1] && currentGame[falling][column] === currentGame[falling][column-2] && currentGame[falling][column] === currentGame[falling][column-3] && currentGame[falling][column] === currentGame[falling][column-4]) match = true
		}
		
		
		// PRINGING THE BOARD
		populateFieldString()
		msg.channel.send(fieldString);

		msg.channel.send(`${color === 1 ? 'red' : 'blue'} disc placed on column ${column+1}!`);
	}
});

client.login(process.env.TOKEN);