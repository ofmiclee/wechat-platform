wechat-platform
===========

[![Join the chat at https://gitter.im/OfMicLee/wechat-platform](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/OfMicLee/wechat-platform?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

微信第三方平台工具模块


## Install

```bash
$ npm install wechat-platform --save
```

## 功能

- ### 授权
  - 获取微信推送给第三方平台的component_verify_ticket（十分钟推送一次）
  - component_verify_ticket换取第三方平台component_access_token
  - component_access_token换取预授权码pre_auth_code。
  - 构建跳转URL，用户授权后获取授权码authorization_code
  - authorization_code换取授权公众号的授权信息

- ### 授权后功能
  - 使用authorizer_access_token访问公众号API

## 代码示例

``` javascript
var OAuth = require('wechat-platform').OAuth;
var Event = require('wechat-platform').Message;
var ComponentToken = require('wechat-platform').ComponentToken;
var AuthorizerToken = require('wechat-platform').AuthorizerToken;

var RedisCo = require('./redisCo');
var config = require('./config');

var redisClient = RedisCo(config.redis).client;
var oAuth = OAuth(config.wechat);

/**
 * 获取第三方平台token
 *
 * result: ComponentToken对象里的access_token
 */
var getComponentToken = function *() {
  var tokenData = JSON.parse(yield redisClient.get(PLATFORM_TOKEN_KEY));
  console.log("=========tokenData-redis============");
  console.log(tokenData);

  if(tokenData) {
    let componentToken = ComponentToken(tokenData);
    if (componentToken.isValid()) {
      return componentToken.data.access_token;
    }
  }

  var ticket = yield redisClient.get(PLATFORM_TICKET_KEY);
  tokenData = yield oAuth.getComponentToken(ticket);
  console.log("=========tokenData-weixin============");
  console.log(tokenData);

  var result = ComponentToken(tokenData);
  redisClient.set(PLATFORM_TOKEN_KEY, JSON.stringify(result.data));

  return result.data.access_token;
}
```

## 交流

有任何问题欢迎email作者：miclee_wj@hotmail.com

或者 [在此提交](https://github.com/OfMicLee/wechat-platform/issues)

## 捐赠
如果wechat-platform帮助到您了，欢迎请作者一杯咖啡。
![捐赠](https://raw.githubusercontent.com/OfMicLee/img-hosting/master/apc38b8h19qk5jcc47.png)
