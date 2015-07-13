"use strict";

var OAuth = require('../').OAuth;
var config = require('./config');
var oauth = new OAuth(config.appid, config.appsecret);

var gc = oauth.getComponentAccessToken;
// console.log(gc.next(gc.next()));
// console.log("=======" + result);

// 使用generator替代回调函数要包含以下几个步骤：
// 创建一个run函数来接受一个generator，并为这个generator提供resume函数。
// 创建一个resume函数来推进generator，然后在resume被异步函数调用时将这个resume函数传递给generator。
// 将resume作为回调传递给我们所有的异步回调函数。这些异步函数在完成时执行resume，这使得我们的generator在每个异步调用完成之时仅仅向前一步。
// function run(generatorFunction) {
//   var generatorItr = generatorFunction(resume);
//   function resume(callbackValue) {
//     console.log(callbackValue);
//     generatorItr.next(callbackValue);
//   }
//   generatorItr.next();
// }
//
// run(oauth.getComponentAccessToken);
// console.log(oauth.getComponentAccessToke());

var co = require('co');
// var thunkify = require('thunkify');
//
// var getMAC=thunkify(arp.getMAC);

co(oauth.getComponentAccessToken())(function(err,result){
     console.log('err: '+err+', result: '+result);
});
