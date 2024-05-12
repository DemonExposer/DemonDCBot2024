const https = require("https");

class Youtube {
	#apiKey;

	constructor(apiKey) {
		this.#apiKey = apiKey;
	}

	/**
	 * Resolves a keyphrase to a Youtube URL
	 * @param {string} keyphrase The search term
	 */
	lookup(keyphrase) {
		return new Promise((resolve, reject) => {
			https.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(keyphrase)}&key=${this.#apiKey}`, res => {
				let actualData = "";
				res.on("data", data => {
					actualData += data;
				});

				res.on("end", () => {
					actualData = JSON.parse(actualData);
					if (actualData["items"].length > 0)
						resolve("https://youtube.com/watch?v=" + actualData["items"][0]["id"]["videoId"]);
				});
			}).on("error", console.error);
		})
	}
}

module.exports = Youtube;
