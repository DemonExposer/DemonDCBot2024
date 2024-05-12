const { REST, Routes } = require("discord.js");

module.exports = async (token, applicationId, guildId, commands) => {
	const rest = new REST().setToken(token);

	try {
		const data = await rest.put(
			Routes.applicationGuildCommands(applicationId, guildId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
};