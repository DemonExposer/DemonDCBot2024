const { SlashCommandBuilder } = require("discord.js");
const { createAudioResource, joinVoiceChannel, createAudioPlayer, NoSubscriberBehavior } = require("@discordjs/voice");

const ytdl = require("ytdl-core");

const player = createAudioPlayer({
	behaviors: {
		noSubscriber: NoSubscriberBehavior.Pause,
	}
});

player.on("error", console.error); // TODO: fix that this crashes on the smallest connection problem. automatically reconnect, might be a problem that it's not using ffmpeg

class PlayCommand {
	static name = "play";
	
	#yt;

	constructor(yt) {
		this.#yt = yt;
		this.data = new SlashCommandBuilder()
			.setName(PlayCommand.name)
			.setDescription("play a yt video through url or search")
			.addStringOption(option => 
				option.setName("url_or_search")
					.setDescription("URL to youtube video or search words")
					.setRequired(true)
			);
	}

	async execute(interaction) {
		if (interaction.member.voice.channelId === null) {
			interaction.reply("You must join a voice channel first");
			return;
		}

		const arg = interaction.options.getString("url_or_search");
		const link = arg.startsWith("https://") ? arg : await this.#yt.lookup(arg);

		interaction.reply(`Playing ${link}`);
		const resource = createAudioResource(ytdl(link, {filter: "audioonly"}));
		player.play(resource);

		joinVoiceChannel({ // TODO: change to a queue
			channelId: interaction.member.voice.channelId,
			guildId: interaction.guild.id,
			adapterCreator: interaction.guild.voiceAdapterCreator,
			selfDeaf: false,
			selfMute: false
		}).subscribe(player);
	}
}

module.exports = PlayCommand;