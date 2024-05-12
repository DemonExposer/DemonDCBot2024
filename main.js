const fs = require("fs");
const Youtube = require("./youtube");
const PlayCommand = require("./commands/playCommand");
const registerCommands = require("./register");
const Bot = require("./bot");

class Main {
	#token;
	#applicationId;
	#guildId;

	#commmands = {};

	constructor(tokenFile, applicationIdFile, guildIdFile, ytApiKeyFile) {
		this.#token = fs.readFileSync(tokenFile, "utf8").trim();
		this.#applicationId = fs.readFileSync(applicationIdFile, "utf8").trim();
		this.#guildId = fs.readFileSync(guildIdFile, "utf8").trim();
		const ytApiKey = fs.readFileSync(ytApiKeyFile, "utf8").trim();

		const yt = new Youtube(ytApiKey);

		this.#commmands[PlayCommand.name] = new PlayCommand(yt);
	}

	register = async () => await registerCommands(this.#token, this.#applicationId, this.#guildId, Object.values(this.#commmands).map(obj => obj.data.toJSON()));

	run = () => new Bot(this.#token, this.#commmands);
}

module.exports = Main;
