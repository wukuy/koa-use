#!/usr/bin/env node
const { request } = require('https');
const axios = require('axios');

module.exports = class NoticePush {
    constructor({ key, type }) {
        this.robotKey = key;
        // wechat, dingTalk
        this.type = type;
    }
    _postNotice(data) {
        if (this.type === 'wechat') {
            return axios.post(`https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${this.robotKey}`, data);
        } else {
            request(`https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${this.robotKey}`);
        }

    }

    appPush(data) {
        return this._postNotice(data);
    }
}

