let _ = require("lodash");
let util = require("util");
const request = require("request");
const getURLs = require('get-hrefs');
let Q = require("q");

class Scrapper {
    constructor(url) {
    }
    getHTML(url) {
        let defer = Q.defer();
        let reqOpts = {
            uri : url,
            method : 'GET'
        };
        request(reqOpts, function (err, res, body) {
            let response = res ? res.body : '';
            defer.resolve(response);
        });
        return defer.promise;
    }
    getURLs(url) {
        let defer = Q.defer();
        this.getHTML(url)
            .then(function (html) {
                let urlList = getURLs(html);
                defer.resolve(urlList);
            });
        return defer.promise;
    }
}

module.exports = Scrapper;