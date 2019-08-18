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

		if(matchesAcc.filter(match => match === 3).length > 0) console.log('fooken match, nice mate!')
		// PRINGING THE BOARD
		populateFieldString()
		msg.channel.send(fieldString)

		msg.channel.send(`${color === 1 ? 'red' : 'blue'} disc placed on column ${column+1}!`)
	}

	if(msg.content === '!cf dupa') { // GAME INITIALIZATION
		currentGame = [
			[0, 1, 0, 0, 0, 1, 0],
			[0, 2, 1, 0, 1, 2, 0],
			[1, 1, 1, 0, 1, 1, 1],
			[2, 2, 1, 1, 1, 2, 2],
			[2, 1, 2, 1, 2, 1, 2],
			[1, 2, 2, 1, 2, 2, 1]
		]
		populateFieldString()

		msg.channel.send(fieldString);
	}
})

client.login(process.env.TOKEN)