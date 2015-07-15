/*!
 * wechat-platform
 *    ComponentAccessToken 第三方平台token
 *
 * Copyright (c) 2015 MicLee
 * MIT Licensed
 */

 "use strict";

/**
 * ComponentAccessToken 第三方平台token
 *
 * Data:
 * ```
 * {
 *    "component_access_token": "COMPONENT_ACCESS_TOKEN",
 *    "expires_in": 7200,
 * }
 * ```
 */
var ComponentAccessToken = function (data) {
  if (!(this instanceof ComponentAccessToken)) {
    return new ComponentAccessToken(data);
  }
  this.data = data;
}

/*!
 * 检查AccessToken是否有效，检查规则为当前时间和过期时间进行对比
 *
 * Examples:
 * ```
 * token.isValid();
 * ```
 */
ComponentAccessToken.prototype.isValid = function () {
  return !!this.data.access_token && (new Date().getTime()) < (this.data.create_at + this.data.expires_in * 1000);
}


 /**
  * Expose `ComponentAccessToken`.
  */
 exports = module.exports = ComponentAccessToken;
