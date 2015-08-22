/*!
 * wechat-platform
 *
 * Copyright (c) 2015 MicLee
 * MIT Licensed
 */

module.exports = {

  /**
   * 授权服务
   */
  OAuth: require('./lib/oauth'),

  /**
   * 授权后代替公众号实现消息与事件接收
   */
  Message: require('./lib/message'),

  /**
   * 第三方平台token
   */
  ComponentToken: require('./lib/componentToken'),

  /**
   * 公众号token
   */
  AuthorizerToken: require('./lib/authorizerToken'),

  /**
   * 代公众号实现业务
   */
  serve: require('./lib/serve')
 }
