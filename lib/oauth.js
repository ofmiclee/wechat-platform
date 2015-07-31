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

/**
* OAuth 平台授权类
*/
var OAuth = function(config) {
 if (!(this instanceof OAuth)) {
    return new OAuth(appid, appsecret);
 }

 if (config.appid && config.appsecret) {
   this.appid = appid;
   this.appsecret = appsecret;
 } else {
   throw new Error('please check your config');
 }

 this.defaults = {};
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
 * 返回结果示例：
 * {
 *  "component_access_token":"61W3mEpU66027wgNZ_MhGHNQDHnFATkDa9-2llqrMBjUwxRSNPbVsMmyD-yq8wZETSoE5NQgecigDrSHkPtIYA",
 *  "expires_in":7200
 * }
 *
 * @param {String} ticket 微信后台推送的ticket 十分钟推送一次
 */
OAuth.prototype.getComponentToken = function *(ticket) {
  var url = 'https://api.weixin.qq.com/cgi-bin/component/api_component_token';
  var info = {
    component_appid: this.appid,
    component_appsecret: this.appsecret,
    component_verify_ticket: ticket
  };
  var args = {
    data: info,
    dataType: 'json',
    method: 'POST'
  };

  return yield _request.call(this, url, args);
}

/**
 * 请求跳转授权页面，生成预授权码
 * http请求方式: POST（请使用https协议）
 * https://api.weixin.qq.com/cgi-bin/component/api_create_preauthcode?component_access_token=xxx
 *
 * 回调返回结果示例：
 * {
 *  "pre_auth_code":"Cx_Dk6qiBE0Dmx4EmlT3oRfArPvwSQ-oa3NL_fwHM7VI08r52wazoZX2Rhpz1dEw",
 *  "expires_in":600
 * }
 *
 * @param {String} token 第三方平台component_access_token
 * @param {String} callbackUrl 用户在第三方平台授权页中完成授权流程后，在回调URI中通过URL参数提供给第三方平台方pre_auth_code
 */
OAuth.prototype.createPreAuthCode = function *(token, callbackUrl) {
  var url = 'https://api.weixin.qq.com/cgi-bin/component/api_create_preauthcode?component_access_token=' + token;
  var info = {
    component_appid: this.appid
  };
  var args = {
    data: info,
    dataType: 'json',
    method: 'POST'
  };

  return yield _request.call(this, url, args);
}

/**
 * 获取公众号的授权信息
 * http请求方式: POST（请使用https协议）
 * https://api.weixin.qq.com/cgi-bin/component/api_query_auth?component_access_token=xxx
 *
 * 返回结果示例：
 * ```
 * {
 *  "authorization_info": {
 *      "authorizer_appid": "wxf8b4f85f3a794e77",
 *      "authorizer_access_token": "QXjUqNqfYVH0yBE1iI_7vuN_9gQbpjfK7hYwJ3P7xOa88a89-Aga5x1NMYJyB8G2yKt1KCl0nPC3W9GJzw0Zzq_dBxc8pxIGUNi_bFes0qM",
 *      "expires_in": 7200,
 *      "authorizer_refresh_token": "dTo-YCXPL4llX-u1W1pPpnp8Hgm4wpJtlR6iV0doKdY"
 *  },
 *  "func_info": [
 *      {
 *       "funcscope_category": { "id": 1 }
 *      },
 *      {
 *       "funcscope_category": { "id": 2 }
 *      },
 *      {
 *       "funcscope_category": { "id": 3 }
 *      }
 *  ]
 * }
 * ```   <===1到8分别代表：1消息与菜单权限集 2用户管理权限集 3帐号管理权限集 4网页授权权限集 5微信小店权限集 6多客服权限集 7业务通知权限集 8微信卡券权限集
 *
 * @param {String} token 第三方平台component_access_token
 * @param {String} code 预授权码pre_auth_code
 */
OAuth.prototype.getAuthorizerToken = function *(token, code) {
  var url = 'https://api.weixin.qq.com/cgi-bin/component/api_query_auth?component_access_token=' + token;
  var info = {
    component_appid: this.appid,
    authorization_code: code
  };
  var args = {
    data: info,
    dataType: 'json',
    method: 'POST'
  };

  return yield _request.call(this, url, args);
}


/**
 * 刷新公众号的授权信息
 * http请求方式: POST（请使用https协议）
 * https://api.weixin.qq.com/cgi-bin/component/api_authorizer_token?component_access_token=xxx
 *
 * 返回结果示例：
 * ```
 *  {
 *   "authorizer_access_token": "QXjUqNqfYVH0yBE1iI_7vuN_9gQbpjfK7hYwJ3P7xOa88a89-Aga5x1NMYJyB8G2yKt1KCl0nPC3W9GJzw0Zzq_dBxc8pxIGUNi_bFes0qM",
 *   "expires_in": 7200,
 *   "authorizer_refresh_token": "dTo-YCXPL4llX-u1W1pPpnp8Hgm4wpJtlR6iV0doKdY"
 *  }
 * ```
 *
 * @param {String} authAppid 授权方appid
 * @param {String} refreshToken 授权方的刷新令牌
 */
OAuth.prototype.refreshAuthorizerToken = function *(authAppid, refreshToken) {
  var url = 'https://api.weixin.qq.com/cgi-bin/component/api_authorizer_token?component_access_token=' + token;
  var info = {
    component_appid: this.appid,
    authorizer_appid: authAppid,
    authorizer_refresh_token: refreshToken
  };
  var args = {
    data: info,
    dataType: 'json',
    method: 'POST'
  };

  return yield _request.call(this, url, args);
}



/**
 * Expose `OAuth`.
 */
exports = module.exports = OAuth;
