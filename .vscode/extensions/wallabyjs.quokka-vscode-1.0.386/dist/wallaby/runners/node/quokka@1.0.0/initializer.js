/*
 * Wallaby.js - v1.0.1115
 * https://wallabyjs.com
 * Copyright (c) 2014-2021 Wallaby.js - All Rights Reserved.
 *
 * This source code file is a part of Wallaby.js and is a proprietary (closed source) software.

 * IMPORTANT:
 * Wallaby.js is a tool made by software developers for software developers with passion and love for what we do.
 * Pirating the tool is not only illegal and just morally wrong,
 * it is also unfair to other fellow programmers who are using it legally,
 * and very harmful for the tool and its future.
 */
var __awaiter=this&&this.__awaiter||function(e,t,i,n){function r(e){return e instanceof i?e:new i(function(t){t(e)})}return new(i||(i=Promise))(function(i,s){function o(e){try{l(n.next(e))}catch(t){s(t)}}function a(e){try{l(n["throw"](e))}catch(t){s(t)}}function l(e){e.done?i(e.value):r(e.value).then(o,a)}l((n=n.apply(e,t||[])).next())})},__generator=this&&this.__generator||function(e,t){function i(e){return function(t){return n([e,t])}}function n(i){if(r)throw new TypeError("Generator is already executing.");for(;l;)try{if(r=1,s&&(o=2&i[0]?s["return"]:i[0]?s["throw"]||((o=s["return"])&&o.call(s),0):s.next)&&!(o=o.call(s,i[1])).done)return o;switch(s=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return l.label++,{value:i[1],done:!1};case 5:l.label++,s=i[1],i=[0];continue;case 7:i=l.ops.pop(),l.trys.pop();continue;default:if(o=l.trys,!(o=o.length>0&&o[o.length-1])&&(6===i[0]||2===i[0])){l=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){l.label=i[1];break}if(6===i[0]&&l.label<o[1]){l.label=o[1],o=i;break}if(o&&l.label<o[2]){l.label=o[2],l.ops.push(i);break}o[2]&&l.ops.pop(),l.trys.pop();continue}i=t.call(e,l)}catch(n){i=[6,n],s=0}finally{r=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}var r,s,o,a,l={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return a={next:i(0),"throw":i(1),"return":i(2)},"function"==typeof Symbol&&(a[Symbol.iterator]=function(){return this}),a},path=require("path"),url=require("url"),Module=require("module"),tracer=global.$_$tracer,utils=tracer._utils,file,entryModule,quokkaSettings={},quokkaSettingsDirNodeModulesPath,quokkaTempDirNodeModulesPath,beforeExitHandlers=[],startTime,serverPath=path.dirname(process.mainModule.filename);utils.patchModulesCode([{files:["scheduler/cjs/scheduler.development.js"],replacements:[{from:"typeof window === 'undefined'",to:"true || typeof window === 'undefined'"}]}]),tracer._maxLogEntrySize=1048576,tracer._hiddenGlobalProps={$_$baseDir:1,$_$slow:1,$_$testFiles:1,$_$tests:1,$_$session:1,$_$initialSpecId:1,$_$coverage:1},process.on("unhandledRejection",function(e){throw e});var localProjectRoot=path.dirname(global.wallaby._localNodeModules);try{quokkaSettings=JSON.parse(process.env.quokka);var quokkaSettingsDirPath=path.dirname(quokkaSettings.globalConfigFile),quokkaTempDirPath=quokkaSettings.tempDir;quokkaSettings.nativeEsm&&(tracer._esm={localProjectDirUrl:url.pathToFileURL(localProjectRoot).href,settingsDirUrl:url.pathToFileURL(quokkaSettingsDirPath).href,tempDirUrl:url.pathToFileURL(quokkaTempDirPath).href}),quokkaSettingsDirNodeModulesPath=path.join(quokkaSettingsDirPath,"node_modules"),quokkaTempDirNodeModulesPath=path.join(quokkaTempDirPath,"node_modules")}catch(e){}var requireFromTheProjectAndGlobalSettingsContext=function(e){var t=Module._load(e,entryModule,!1);try{var i=Module._resolveFilename(e,entryModule,!1);tracer._doWhenReceiverIsReady(function(){tracer._send("module",{path:i})})}catch(n){}return t};requireFromTheProjectAndGlobalSettingsContext.extensions=require.extensions,requireFromTheProjectAndGlobalSettingsContext.resolve=require.resolve;var rootEntryModule=new Module(".",null);rootEntryModule.filename=path.join(localProjectRoot,"index.js"),rootEntryModule.path=localProjectRoot,rootEntryModule.paths=Module._nodeModulePaths(localProjectRoot).concat([quokkaSettingsDirNodeModulesPath]);var requireFromTheProjectRootAndGlobalSettingsContext=function(e){return Module._load(e,rootEntryModule,!1)};requireFromTheProjectRootAndGlobalSettingsContext.extensions=require.extensions,requireFromTheProjectRootAndGlobalSettingsContext.resolve=require.resolve;var hideProp=function(e){Object.defineProperty(global,e,{enumerable:!1,value:global[e]})};Object.keys(global).filter(function(e){return"wallaby"===e||0===e.indexOf("$_$")}).forEach(function(e){hideProp(e)}),require.extensions[".jsx"]=require.extensions[".js"];var registerAssetExtensions=function(){[".png",".svg",".ico","jpeg",".jpg",".css",".less",".scss",".sass",".htm",".html"].forEach(function(e){require.extensions[e]=function(){}})};tracer._identifierExpressionAutoLogHitLimit=10,tracer._logLimit=Math.max(quokkaSettings.logLimit||100,10);var toInitialize={babel:!0,ts:!0,js:!0,plugins:!0,globals:["assert","events","fs","os","path"]},runBeforeEach=[],starter={quokkaStackTraceMarker:function(){return __awaiter(this,void 0,void 0,function(){var sessionId,babelConfig,babelMajorVersion,ignore,beforeExitHandler,runner;return __generator(this,function(_a){switch(_a.label){case 0:if(sessionId=global.$_$session,quokkaSettings.babel&&toInitialize.babel){if(babelConfig={ignore:"string"==typeof quokkaSettings.babel.ignore?new RegExp(quokkaSettings.babel.ignore):"[object Array]"===Object.prototype.toString.call(quokkaSettings.babel.ignore)?quokkaSettings.babel.ignore:function(e){return~e.indexOf("quokka.js")||~e.indexOf("node_modules")},presets:quokkaSettings.babel.presets,plugins:quokkaSettings.babel.plugins,extensions:[".js",".jsx",".es6",".es",".mjs",".ts",".tsx"]},babelMajorVersion=NaN,quokkaSettings.babel.version&&(babelMajorVersion=parseInt(quokkaSettings.babel.version.split(".")[0],10)),babelMajorVersion>=7){utils.patchBabelResolve(quokkaSettings.babel.path);try{"[object Array]"!==Object.prototype.toString.call(babelConfig.ignore)&&(babelConfig.ignore=[babelConfig.ignore]),require(path.join(path.dirname(quokkaSettings.babel.path),"register"))(babelConfig)}catch(e){try{utils.patchModule("@babel/core",function(){return require(quokkaSettings.babel.path)}),require(quokkaSettings.babel.registerPath)(babelConfig)}catch(e){console.warn("@babel/register could not be launched properly. This may indicate that your project packages are not compatible with your current version of Quokka.\nPlease install @babel/register as a project dependency.\nYou may install the module in your project by running `npm install @babel/register` command.")}}}else require(path.join(quokkaSettings.babel.path,"register"))(babelConfig);if(quokkaSettings.babel.polyfill&&(babelMajorVersion>=7?require(path.join(path.dirname(quokkaSettings.babel.path),"polyfill")):require(path.join(path.dirname(quokkaSettings.babel.path),"babel-polyfill"))),quokkaSettings.babel.tsconfigPaths)try{require(path.join(quokkaSettings.babel.tsconfigPaths.path,"register"))}catch(e){}delete toInitialize.babel}if(quokkaSettings.ts&&toInitialize.ts){ignore=quokkaSettings.ts.tsNode.ignore||["(?:^|/)node_modules/"],ignore=Array.isArray(ignore)?ignore:[ignore],ignore.push(serverPath),require(path.join(quokkaSettings.ts.tsNode.path)).register({compiler:process.env.TS_NODE_COMPILER,ignore:ignore});try{quokkaSettings.ts.tsconfigPaths&&require(path.join(quokkaSettings.ts.tsconfigPaths.path,"register"))}catch(e){}delete toInitialize.ts}if(quokkaSettings.js&&toInitialize.js&&quokkaSettings.js.compilerOptions&&quokkaSettings.js.compilerOptions.baseUrl&&quokkaSettings.js.compilerOptions.paths){try{require(path.join(quokkaSettings.js.tsconfigPaths.path,"lib","register")).register(quokkaSettings.js.compilerOptions)}catch(e){}delete toInitialize.js}if(quokkaSettings.plugins&&toInitialize.plugins){if(quokkaSettings.builtInPlugins&&quokkaSettings.builtInPlugins.find(function(e){return"auto-detect:create-react-app"===e}))try{global.React=requireFromTheProjectRootAndGlobalSettingsContext("react")}catch(e){}"string"==typeof quokkaSettings.plugins&&(quokkaSettings.plugins=[quokkaSettings.plugins]),quokkaSettings.plugins.slice().forEach(function(e){if("jsdom-quokka-plugin"===e){var t=require("./jsdomQuokkaPlugin");t.before&&t.before(requireFromTheProjectRootAndGlobalSettingsContext,quokkaSettings),t.beforeEach&&runBeforeEach.push(t.beforeEach)}else{var t=requireFromTheProjectRootAndGlobalSettingsContext(e);t.before&&t.before(quokkaSettings),t.beforeEach&&runBeforeEach.push(t.beforeEach)}}),delete toInitialize.plugins}toInitialize.globals&&(toInitialize.globals.forEach(function(e){global[e]||(global[e]=require(e))}),delete toInitialize.globals),runBeforeEach.forEach(function(e){e(quokkaSettings)}),registerAssetExtensions(),beforeExitHandler=function(){if(tracer._asyncCodeMayBeExecuting=!1,tracer.refWebSocket(),sessionId!==global.$_$session)return void delete tracer._pong;var e;if(startTime){var t=process.hrtime(startTime);e=(1e3*t[0]+t[1]/1e6).toFixed(2)}tracer._pong&&(tracer._pong(),delete tracer._pong),tracer.complete({time:e})},process.once("beforeExit",beforeExitHandler),beforeExitHandlers.push(beforeExitHandler),runner={quokkaStackTraceMarker:function(){return __awaiter(this,void 0,void 0,function(){var fileUrl;return __generator(this,function(_a){switch(_a.label){case 0:return startTime=process.hrtime(),quokkaSettings&&quokkaSettings.nativeEsm?(fileUrl=url.pathToFileURL(file.path.replace(/$quokka.js^/,"quokka.mjs")),fileUrl.href=fileUrl.href+"?session="+sessionId,tracer._esm.scratchFileUrl=fileUrl.href,tracer._esm.scratchFileContent=file.content,[4,eval("import(fileUrl)")]):[3,2];case 1:return _a.sent(),[3,3];case 2:entryModule._compile(file.content,file.path),_a.label=3;case 3:return[2]}})})}},_a.label=1;case 1:return _a.trys.push([1,,3,4]),[4,runner.quokkaStackTraceMarker()];case 2:return _a.sent(),[3,4];case 3:return tracer._asyncCodeMayBeExecuting=!0,tracer.unrefWebSocket(),[7];case 4:return[2]}})})}};tracer.start(starter.quokkaStackTraceMarker),module.exports={init:function(e){return file={path:e[0],content:global.$_$testFiles[0].content},entryModule=new Module(".",null),entryModule.filename=file.path,entryModule.path=path.dirname(file.path),entryModule.paths=Module._nodeModulePaths(path.dirname(entryModule.filename)).concat([quokkaTempDirNodeModulesPath,quokkaSettingsDirNodeModulesPath]),entryModule.require=requireFromTheProjectAndGlobalSettingsContext,quokkaSettings&&(quokkaSettings.filePath=file.path),beforeExitHandlers.forEach(function(e){process.removeListener("beforeExit",e)}),beforeExitHandlers.length=0,Object.keys(tracer._hiddenGlobalProps).forEach(function(e){hideProp(e)}),{}}};