/*!
 * wechat-platform
 *    OAuth 平台授权
 *
 * Copyright (c) 2015 MicLee
 * MIT Licensed
 */

/**
 * V8引擎只在严格模式之下，支持let、const、class
 */
"use strict";

/**
 * Module dependencies.
 */
var urllib = require('urllib');
var extend = require('util')._extend;
var PlatformToken = require('./componentAccessToken');

/**
* OAuth 平台授权类
*/
// 参数默认值和解构赋值不支持  坑！！
// var OAuth = function(appid, appsecret, tokenMethod = {
//                getToken: _defaultGetToken,
//                saveToken: _defaultSaveToken
//             }) {
//   this.appid = appid;
//   this.appsecret = appsecret;
// }
var OAuth = function(appid, appsecret, getToken, saveToken) {
 this.appid = appid;
 this.appsecret = appsecret;

 // token的获取和存储
 this.store = {};
 this.getToken = getToken || _defaultGetToken
 this.saveToken = saveToken || _defaultSaveToken
 this.defaults = {};
}

var _defaultGetToken = function *(openid) {
 //TODO 改为从REDIS取
 return yield this.store[openid];
}
var _defaultSaveToken = function *(openid, token) {
 //TODO 改为存到REDIS
 yield this.store[openid] = token;
}

/* ---------------------------- 业务 API ---------------------------- */

/**
 * urllib的封装
 *
 * @param {String} url 路径
 * @param {Object} opts urllib选项
 *
 * @private
 */
var _request = function *(url, opts) {
 var options = {};
 extend(options, this.defaults);

 for (let key in opts) {
   if (key !== 'headers') {
     options[key] = opts[key];
   } else {
     if (opts.headers) {
       options.headers = options.headers || {};
       extend(options.headers, opts.headers);
     }
   }
 }

 return yield urllib.request(url, options);
}


/**
 * 用于设置urllib的默认options
 *
 * Examples:
 * ```
 * oauth.setOpts({timeout: 15000});
 * ```
 * @param {Object} opts 默认选项
 */
OAuth.prototype.setOptions = function (options) {
  this.defaults = options;
}

/**
 * 获取第三方平台令牌（component_access_token）
 * http请求方式: POST（请使用https协议）
 * https://api.weixin.qq.com/cgi-bin/component/api_component_token
 *
 * @param {String} appid 第三方平台appid
 * @param {String} appsecret 第三方平台appsecret
 * @param {String} ticket 微信后台推送的ticket 十分钟推送一次
 */
OAuth.prototype.getComponentAccessToken = function *() {
  var url = 'https://api.weixin.qq.com/cgi-bin/component/api_component_token';
  var info = {
    component_appid: this.appid,
    component_appsecret: this.appsecret,
    component_verify_ticket: yield _getTicket()
  };
  var args = {
    data: info,
    dataType: 'json',
    method: 'POST'
  };

  return yield _request.call(this, url, args);
}

/**
 * 从内部获取ticket
 * 后面改写为异步取
 */
var _getTicket = function *() {
  return "11111122222333333xxxxxxyyyyyy";
}

/**
 * 获取预授权码（component_access_token）
 * http请求方式: POST（请使用https协议）
 * https://api.weixin.qq.com/cgi-bin/component/api_create_preauthcode?component_access_token=xxx
 */
OAuth.prototype.createPreauthcode = function *() {
  return '122333';
}



/**
 * Expose `OAuth`.
 */
exports = module.exports = OAuth;
