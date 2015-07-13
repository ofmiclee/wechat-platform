/*!
 * wechat-platform
 *
 * Copyright (c) 2015 MicLee
 * MIT Licensed
 */

module.exports = {

  /**
   * 第三方验证
   */
  OAuth: require('./lib/oauth'),

  /**
   * 授权后代替公众号实现消息与事件接收
   */
  Message: require('./lib/message')
}
