module.exports = {
    execute: function (message, args, utils) {
        const axios = require("axios");
		var cls = utils.apis["core-cls"].api;
        axios.get(`https://en.wikipedia.org/api/rest_v1/page/${args[0] == undefined ? "random/summary" : "summary/" + args.join("_").replace("/", "%2F")}`)
			.then(json => {
				const isDisambiguation = json.data.description != undefined && json.data.description == "Topics referred to by the same term";
				const isSection = json.request.res.responseUrl.includes("#");
				if(isDisambiguation) return message.reply({ content: cls.getString("wikipedia", "disambiguation").replace("$0", json.data.title).replace("$1", json.data.content_urls.desktop.page), allowedMentions: { parse: [] }});
				if(isSection) {
					const sectionName = new URL(json.request.res.responseUrl).hash;
					return message.reply({ content: cls.getString("wikipedia", "section").replace("$0", json.data.content_urls.desktop.page + sectionName), allowedMentions: { parse: [] }});
				}
				return message.reply({ content: `**${json.data.title}**: ${json.data.extract == "" ? json.data.description == undefined ? cls.getString("wikipedia", "noinfo").replace("$0", json.data.content_urls.desktop.page) : json.data.description + ". " + cls.getString("wikipedia", "moreinfo").replace("$0", json.data.content_urls.desktop.page) : json.data.extract + " " + cls.getString("wikipedia", "moreinfo").replace("$0", json.data.content_urls.desktop.page)}`, allowedMentions: { parse: [] }})
			})
			.catch(function(error) {
				if(error && error.response && error.response.data && error.response.data.detail) return message.reply({ content: `${args[0] == null ? "" : `**${args.join(" ")}**: `}${error.response.data.detail}`, allowedMentions: { parse: [] }});
				if(error && error.response && error.response.data && error.response.data.title) return message.reply({ content: `${args[0] == null ? "" : `**${args.join(" ")}**: `}${error.response.data.title}`, allowedMentions: { parse: [] }});
				if(error) console.error(error);
				message.reply({ content: cls.getString("core", "error.generic")});
			});
    }
}