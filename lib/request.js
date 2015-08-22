/*!
 * wechat-platform
 *    request 请求工具类
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

const DEFAULTS = {
    headers: {
      'Content-Type': 'application/json'
    }
};

/**
 * 处理返回结果
 */
var _resWrapper = function (response) {
  var data = response.data;
  if (data.errcode) {
    var err = new Error(data.errmsg);
    err.name = 'WechatAPIError';
    err.code = data.errcode;
    throw err;
  }
  return data;
}

/**
 * urllib的封装
 *
 * @param {String} url 路径
 * @param {Object} opts urllib选项
 *
 * @private
 */
module.exports = function *(url, opts) {
 var options = {};
 extend(options, DEFAULTS);

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

 return _resWrapper(yield urllib.requestThunk(url, options));
}
