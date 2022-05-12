module.exports = {
    execute: function (message, args) {
        const axios = require("axios");
        axios.get(`https://en.wikipedia.org/api/rest_v1/page/${args[0] == undefined ? "random/summary" : "summary/" + args.join("_").replace("/", "%2F")}`)
			.then(json => {
				const isDisambiguation = json.data.description != undefined && json.data.description == "Topics referred to by the same term";
				const isSection = json.request.res.responseUrl.includes("#");
				if(isDisambiguation) return message.reply(`**${json.data.title}** refers to multiple things. Try something more specific listed here: <${json.data.content_urls.desktop.page}>`);
				if(isSection) {
					const sectionName = new URL(json.request.res.responseUrl).hash;
					return message.reply(`It looks like you have been redirected to a section of an article, or tried to access one. Sections are not currently supported.\nPlease view the page at <${json.data.content_urls.desktop.page + sectionName}>.`);
				}
				return message.reply(`**${json.data.title}**: ${json.data.extract == "" ? json.data.description == undefined ? `Sorry, but no information about this article is available. You can ask Vukky to add a short description, or read the article at <${json.data.content_urls.desktop.page}>.` : json.data.description + `. For more information, read the article at <${json.data.content_urls.desktop.page}>.` : json.data.extract + ` For more information, read the article at <${json.data.content_urls.desktop.page}>.`}`)
			})
			.catch(function(error) {
				if(error && error.response && error.response.data && error.response.data.detail) return message.reply({ content: `${args[0] == null ? "" : `**${args.join("_")}**: `}${error.response.data.detail}\nContact Vukky for more details.`});
				if(error && error.response && error.response.data && error.response.data.title) return message.reply({ content: `${args[0] == null ? "" : `**${args.join("_")}**: `}${error.response.data.title}\nContact Vukky for more details.`});
				if(error && error.response && error.response.status && error.response.status == 404) return message.reply({ content: "The wiki you are trying to access does not support Pukkie.\nContact Vukky for more details."});
				console.error(error);
				message.reply({ content: "Welp! Something went wrong."});
			});
    }
}