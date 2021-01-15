let _ = require("lodash");
let util = require("util");
const request = require("request");
const getURLs = require('get-hrefs');
let Q = require("q");
const Instagram = require('instagram-web-api');
const FileCookieStore = require('tough-cookie-filestore2')
const cookieStore = new FileCookieStore('./cookies.json')

class InstaTools {
    constructor() {
        const { username, password } = process.env // Only required when no cookies are stored yet
        const cookieStore = new FileCookieStore('./cookies.json');
        this.client = new Instagram({ username, password, cookieStore});
    }
    async login() {
        util.log("Logging in");
        return await this.client.login();
    }
    async getMediaUrls(username) {
        return await this.client.getPhotosByUsername({ username: username });
    }
    getFormattedMediaURLs(username) {
        let defer = Q.defer(),
            mediaUrls = [];
        this.getMediaUrls(username)
            .then(function (response) {
                _.forEach(_.get(response, ['user', 'edge_owner_to_timeline_media', 'edges'], []), function (mediaObj) {
                   let mediaSingle = {
                       'display_url' : _.get(mediaObj, ['node', 'is_video']) ? _.get(mediaObj, ['node', 'video_url']) : _.get(mediaObj, ['node', 'display_url']),
                       'caption' : _.get(mediaObj, ['node', 'edge_media_to_caption', 'edges', [0], 'node', 'text'])
                   }
                   if (mediaSingle.display_url) {
                       mediaUrls.push(mediaSingle);
                   }
                });
                defer.resolve(mediaUrls);
            })
            .catch(function (err) {
                defer.reject(err);
            })
        return defer.promise;
    }
}
module.exports = InstaTools;