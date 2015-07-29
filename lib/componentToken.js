/*!
 * wechat-platform
 *    ComponentToken 第三方平台token
 *
 * Copyright (c) 2015 MicLee
 * MIT Licensed
 */

 "use strict";

/**
 * ComponentToken 第三方平台token
 *
 * Data:
 * ```
 * {
 *    "component_access_token": "COMPONENT_ACCESS_TOKEN",
 *    "expires_in": 7200,
 * }
 * ```
 */
var ComponentToken = function (data) {
  if (!(this instanceof ComponentToken)) {
    return new ComponentToken(data);
  }

  if(data) {
    this.data = data.create_time ? data : initData(data);
  } else {
    throw new Error('data is invalid');
  }
}

/*!
 * 规则化
 */
var _initData = function(data) {
  var result = {
    access_token: data.component_access_token,
    expires_in: data.expires_in,
    create_time: new Date().getTime()
  }

  return result;
}

/*!
 * 检查AccessToken是否有效，检查规则为当前时间和过期时间进行对比
 *
 * Examples:
 * ```
 * token.isValid();
 * ```
 */
ComponentToken.prototype.isValid = function () {
  return !!this.data.access_token && (new Date().getTime()) < (this.data.create_time + this.data.expires_in * 1000);
}


/**
 * Expose `ComponentToken`.
 */
exports = module.exports = ComponentToken;
