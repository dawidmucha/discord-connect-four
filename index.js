require('dotenv').config()

let emptyField = [
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0]
]
let currentGame = emptyField
let fieldString = ''

const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === '!cf start') { // GAME INITIALIZATION
		msg.channel.send("Initializing the game!");
		
		currentGame = emptyField
		fieldString = ''
		fieldString = fieldString.concat(':one: :two: :three: :four: :five: :six: :seven:\n')

		for(let i = 0; i <= 5; i++) {
			for(let j = 0; j <= 6; j++) {
				fieldString = fieldString.concat(':white_circle: ')
			}
			fieldString = fieldString.concat('\n')
		}

		msg.channel.send(fieldString);
		msg.channel.send("Type '!cf red [number]' or '!cf blue [number]' to start!");
	}
});

client.login(process.env.TOKEN);