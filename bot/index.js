const { Telegraf } = require('telegraf');
let _ = require("lodash");
let util = require("util");
let scrapperClass = require("../lib/scrapper");
let scrapper = new scrapperClass();
let Q = require("q");

class InstaFetch{
    constructor(instaTools) {
        this.instaTools = instaTools;
        this.API_KEY = process.env.TELEGRAM_TOKEN;
        this.bot = new Telegraf(this.API_KEY);
    }
    launch() {
        util.log("Launching the bot...");
        this.bot.launch();
    }
    addWelcomeText() {
        this.bot.start((ctx) => ctx.reply('Welcome to Insta Fetch. Please enter a username of instagram and we will fetch the last 10 posts of it.')); // display Welcome text when we start bot
    }
    addInstaCommand() {
        let self = this;
        this.bot.on('text', (ctx) => {
            let input = _.get(ctx, ['update', 'message', 'text']);
            input = this.parseInstagramUserName(input);
            util.format('https://www.instagram.com/%s/', input);
            Q()
                .then(function () {
                    return self.instaTools.getFormattedMediaURLs(input);
                })
                .then(function (mediaUrls) {
                    ctx.reply('We have fetched total ' + mediaUrls.length + ' posts.');
                    _.forEach(mediaUrls || [], function (media) {
                        let htmlResponse = util.format('<a href="%s">%s</a>', media.display_url, media.caption);
                        ctx.replyWithHTML(htmlResponse);
                    })
                })
                .catch(function () {
                    return ctx.reply(`Some error has occured`);
                });
        });
    }
    parseInstagramUserName(input) {
        return input;
    }
}

module.exports = InstaFetch;