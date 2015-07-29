/*!
 * wechat-platform
 *    AuthorizerToken 授权后公众号token
 *
 * Copyright (c) 2015 MicLee
 * MIT Licensed
 */

 "use strict";

/**
 * AuthorizerToken 授权后公众号token
 *
 * Data:
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
 */
var AuthorizerToken = function (data) {
  if (!(this instanceof AuthorizerToken)) {
    return new AuthorizerToken(data);
  }

  if(data && data.authorization_info) {
    this.data = data.authorization_info.create_time ? data : initData(data);
  } else {
    throw new Error('data is invalid');
  }
}

/*!
 * 规则化
 */
var _initData = function(data) {
  data.authorization_info.create_time = new Date().getTime();
  return data;
}

/*!
 * 检查AccessToken是否有效，检查规则为当前时间和过期时间进行对比
 *
 * Examples:
 * ```
 * token.isValid();
 * ```
 */
AuthorizerToken.prototype.isValid = function () {
  var authInfo = this.data.authorization_info;
  return !!authInfo.authorizer_access_token && (new Date().getTime()) < (authInfo.create_time + authInfo.expires_in * 1000);
}


/**
 * Expose `AuthorizerToken`.
 */
exports = module.exports = AuthorizerToken;
