/*!
 * wechat-platform
 *    Message 授权后代替公众号实现消息与事件接收
 *
 * Copyright (c) 2015 MicLee
 * MIT Licensed
 */

 "use strict";

 var Message = function(token, key) {
   if(!(this instanceof Message)) {
     return new Message(token, key);
   }
   this.token = token;
   this.key = key;
 }


/**
 * Expose `Message`.
 */
exports = module.exports = Message;
