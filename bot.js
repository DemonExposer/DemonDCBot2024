const { Client, Events, GatewayIntentBits } = require("discord.js");
const { generateDependencyReport } = require("@discordjs/voice");

const client = new Client({ intents: [GatewayIntentBits.GuildEmojisAndStickers |
	GatewayIntentBits.Guilds |
	GatewayIntentBits.GuildMessagePolls |
	GatewayIntentBits.GuildMessageReactions |
	GatewayIntentBits.GuildMessageTyping |
	GatewayIntentBits.GuildMessages |
	GatewayIntentBits.GuildVoiceStates
]});

class Bot {
	constructor(token, commands) {
		client.once(Events.ClientReady, readyClient => {
			console.log("logged in");
		});

		client.on(Events.InteractionCreate, async interaction => {
			const command = commands[interaction.commandName];
			await command.execute(interaction);
		});

		client.on(Events.Error, console.error);

		console.log(generateDependencyReport());
		client.login(token);
	}
}

module.exports = Bot;
