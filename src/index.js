module.exports = {
    execute: function (message, args) {
        axios.get(`https://en.wikipedia.org/api/rest_v1/page/${args[0] == undefined ? "random/summary" : "summary/" + args.join("_").replace("/", "%2F")}`)
			.then(json => {
				const isDisambiguation = json.data.description != undefined && json.data.description == "Topics referred to by the same term";
				const isSection = json.request.res.responseUrl.includes("#");
				if(isDisambiguation) return interaction.reply(`**${json.data.title}** refers to multiple things. Try something more specific listed here: <${json.data.content_urls.desktop.page}>`);
				if(isSection) {
					const sectionName = new URL(json.request.res.responseUrl).hash;
					return interaction.reply(`It looks like you have been redirected to a section of an article, or tried to access one. Sections are not currently supported.\nPlease view the page at <${json.data.content_urls.desktop.page + sectionName}>.`);
				}
				return interaction.reply(`**${json.data.title}**: ${json.data.extract == "" ? json.data.description == undefined ? `Sorry, but no information about this article is available. You can ask Vukky to add a short description, or read the article at <${json.data.content_urls.desktop.page}>.` : json.data.description + `. For more information, read the article at <${json.data.content_urls.desktop.page}>.` : json.data.extract + ` For more information, read the article at <${json.data.content_urls.desktop.page}>.`}`)
			})
    }
}