/*!
 * wechat-platform
 *    Message 1、授权成功后代替公众号接收与回复消息
 *            2、微信推送给第三方平台的消息，如ticket、取消授权
 *
 * Copyright (c) 2015 MicLee
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */
var wechatMsg = require('co-wechat');

/**
 * 第三方平台代收发消息必须加密
 *
 * @param {String} msg_token  开放平台上，开发者设置的Token
 * @param {String} msg_aeskey 开放平台上，开发者设置的EncodingAESKey
 * @param {String} appid      第三方平台AppId
 */
var Message = function (config) {
  if (!(this instanceof Message)) {
    return new Message(config);
  }

  if (config.msg_token && config.msg_aeskey && config.appid) {
    this.config = {
      appid: config.appid,
      token: config.msg_token,
      encodingAESKey: config.msg_aeskey
    }
  } else {
    throw new Error('please check your config');
  }
}

Message.prototype.proxy = function(handle) {
  wechatMsg(this.config).middleware(handle);
}

/**
 * Expose `Message`.
 */
exports = module.exports = Message;
