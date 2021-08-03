!function(e){function t(n){if(r[n])return r[n].exports;var a=r[n]={i:n,l:!1,exports:{}};return e[n].call(a.exports,a,a.exports,t),a.l=!0,a.exports}var r={};t.m=e,t.c=r,t.i=function(e){return e},t.d=function(e,r,n){t.o(e,r)||Object.defineProperty(e,r,{configurable:!1,enumerable:!0,get:n})},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=6)}([function(e,t){e.exports=require("path")},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.ngdocScheme="ngdoc",t.TS_MODE={language:"typescript",scheme:"file"};!function(e){e.authentication={get method(){return"angulardoc/authentication"}}}(t.ServerRequest||(t.ServerRequest={}));!function(e){e.metadata={get method(){return"angulardoc/server"}}}(t.ServerNotification||(t.ServerNotification={}));!function(e){e.metadata={get method(){return"angulardoc/migrationRepo"}}}(t.MigrationRepoNotification||(t.MigrationRepoNotification={}));!function(e){e.metadata={get method(){return"angulardoc/metadata"}}}(t.ServerMetadata||(t.ServerMetadata={}));!function(e){e.params={get method(){return"angulardoc/configurationChanged"}}}(t.ConfigurationChanged||(t.ConfigurationChanged={}))},function(e,t,r){"use strict";var n=this&&this.__extends||function(){var e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])};return function(t,r){function n(){this.constructor=t}e(t,r),t.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}}();Object.defineProperty(t,"__esModule",{value:!0});var a=r(13),i=r(12),s=r(11),o=r(0),c=r(8),l=r(7),u=r(10),p=r(9),f={"ng-readonly":"[readonly]","data-ng-readonly":"[readonly]","ng-selected":"[selected]","data-ng-selected":"[selected]","ng-srcset":"srcset","data-ng-srcset":"srcset","ng-blur":"(blur)","ng-change":"(change)","ng-click":"(click)","ng-copy":"(copy)","ng-cut":"(cut)","ng-dblclick":"(dblclick)","ng-focus":"(focus)","ng-keydown":"(keydown)","ng-keypress":"(keypress)","ng-keyup":"(keyup)","ng-mousedown":"(mousedown)","ng-mouseenter":"(mouseenter)","ng-mouseleave":"(mouseleave)","ng-mousemove":"(mousemove)","ng-mouseover":"(mouseover)","ng-mouseup":"(mouseup)","ng-paste":"(paste)","data-ng-blur":"(blur)","data-ng-change":"(change)","data-ng-click":"(click)","data-ng-copy":"(copy)","data-ng-cut":"(cut)","data-ng-dblclick":"(dblclick)","data-ng-focus":"(focus)","data-ng-keydown":"(keydown)","data-ng-keypress":"(keypress)","data-ng-keyup":"(keyup)","data-ng-mousedown":"(mousedown)","data-ng-mouseenter":"(mouseenter)","data-ng-mouseleave":"(mouseleave)","data-ng-mousemove":"(mousemove)","data-ng-mouseover":"(mouseover)","data-ng-mouseup":"(mouseup)","data-ng-paste":"(paste)"},h=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t._prevClosing=0,t._visitedElements=new Set,t}return n(t,e),t.prototype.visitDirective=function(t,r){e.prototype.visitDirective.call(this,t,r)},t.prototype.visitDirectiveProperty=function(t,r){e.prototype.visitDirectiveProperty.call(this,t,r)},t.prototype.visitBoundText=function(e,t){var r=e.sourceSpan,n=e.value.source;this.createRemoveCtrlFailed(n,r)},t.prototype.visitAttr=function(e,t){var r=e.sourceSpan;this.createReplace(e,r),this.createRemoveCtrlFailedForAttr(e.value,e.name,r)},t.prototype.createReplace=function(e,t){var r,n,a="Replace 'ng-model' with 'NgModel'",i="";if(e&&e.name)if("ng-cloak"===e.name||"data-ng-cloak"===e.name)a="Remove "+e.name,n=this.createReplacement(t.start.offset,t.end.offset-t.start.offset,""),this.addFailure(this.createFailure(t.start.offset,t.end.offset-t.start.offset,a,n));else if("ng-minlength"===e.name||"data-ng-minlength"===e.name)a="Replace "+e.name+" with minlength",n=this.createReplacement(t.start.offset,e.name.length,"minlength"),this.addFailure(this.createFailure(t.start.offset,t.end.offset-t.start.offset,a,n));else if("ng-disabled"===e.name||"data-ng-disabled"===e.name)a="Replace "+e.name+" with [disabled]",n=this.createReplacement(t.start.offset,e.name.length,"[disabled]"),this.addFailure(this.createFailure(t.start.offset,t.end.offset-t.start.offset,a,n));else if("ng-checked"===e.name||"data-ng-checked"===e.name)a="Replace "+e.name+" with [checked]",n=this.createReplacement(t.start.offset,e.name.length,"[checked]"),this.addFailure(this.createFailure(t.start.offset,t.end.offset-t.start.offset,a,n));else if("ui-sref"===e.name)a="Replace "+e.name+" with [routerLink]",n=this.createReplacement(t.start.offset,e.name.length,"[routerLink]"),this.addFailure(this.createFailure(t.start.offset,t.end.offset-t.start.offset,a,n));else if("ui-sref-active"===e.name)a="Replace "+e.name+" with routerLinkActive",n=this.createReplacement(t.start.offset,e.name.length,"routerLinkActive"),this.addFailure(this.createFailure(t.start.offset,t.end.offset-t.start.offset,a,n));else if("ng-submit"===e.name||"data-ng-submit"===e.name)a="Replace "+e.name+" with (ngSubmit)",n=this.createReplacement(t.start.offset,e.name.length,"(ngSubmit)"),this.addFailure(this.createFailure(t.start.offset,t.end.offset-t.start.offset,a,n));else if("ng-model"===e.name||"data-ng-model"===e.name)a="Replace "+e.name+" with [(ngModel)]",i=this.removeDoubleBrace(e.value),r='[(ngModel)]="'+i+'"',n=this.createReplacement(t.start.offset,t.end.offset-t.start.offset,r),this.addFailure(this.createFailure(t.start.offset,t.end.offset-t.start.offset,a,n));else if("ng-change"===e.name||"data-ng-change"===e.name)a="Replace "+e.name+" with (ngModelChange)",n=this.createReplacement(t.start.offset,e.name.length,"(ngModelChange)"),this.addFailure(this.createFailure(t.start.offset,t.end.offset-t.start.offset,a,n));else if("ng-src"===e.name||"data-ng-src"===e.name)a="Replace "+e.name+" with [src]",i=this.removeDoubleBrace(e.value),r='[src]="'+i+'"',n=this.createReplacement(t.start.offset,t.end.offset-t.start.offset,r),this.addFailure(this.createFailure(t.start.offset,t.end.offset-t.start.offset,a,n));else if("ng-if"===e.name||"data-ng-if"===e.name)a="Replace "+e.name+" with *ngIf",n=this.createReplacement(t.start.offset,e.name.length,"*ngIf"),this.addFailure(this.createFailure(t.start.offset,t.end.offset-t.start.offset,a,n));else if("ng-href"===e.name||"data-ng-href"===e.name)a="Replace "+e.name+" with [href]",i=this.removeDoubleBrace(e.value),r='[href]="'+i+'"',n=this.createReplacement(t.start.offset,t.end.offset-t.start.offset,r),this.addFailure(this.createFailure(t.start.offset,t.end.offset-t.start.offset,a,n));else if("ng-class"===e.name||"data-ng-class"===e.name)a="Replace "+e.name+" with [ngClass]",i=this.removeDoubleBrace(e.value),r='[ngClass]="'+i+'"',n=this.createReplacement(t.start.offset,t.end.offset-t.start.offset,r),this.addFailure(this.createFailure(t.start.offset,t.end.offset-t.start.offset,a,n));else if("ng-click"===e.name||"data-ng-click"===e.name)a="Replace "+e.name+" with (click)",i=this.removeDoubleBrace(e.value),r='(click)="'+i+'"',n=this.createReplacement(t.start.offset,t.end.offset-t.start.offset,r),this.addFailure(this.createFailure(t.start.offset,t.end.offset-t.start.offset,a,n));else if("ng-show"===e.name||"data-ng-show"===e.name)a="Replace "+e.name+" with [hidden]",i=e.value,i=i&&(i.trim().indexOf("&")>-1||i.trim().indexOf("|")>-1)?i&&i.trim().startsWith("(")&&i.trim().endsWith(")")?"!"+i:"!("+i+" )":"!"+i,r='[hidden]="'+i+'"',n=this.createReplacement(t.start.offset,t.end.offset-t.start.offset,r),this.addFailure(this.createFailure(t.start.offset,t.end.offset-t.start.offset,a,n));else if("ng-hide"===e.name||"data-ng-hide"===e.name)a="Replace "+e.name+" with [hidden]",n=this.createReplacement(t.start.offset,e.name.length,"[hidden]"),this.addFailure(this.createFailure(t.start.offset,t.end.offset-t.start.offset,a,n));else if("ng-style"===e.name||"data-ng-style"===e.name)a="Replace "+e.name+" with [ngStyle]",i=this.removeDoubleBrace(e.value),r='[ngStyle]="'+i+'"',n=this.createReplacement(t.start.offset,t.end.offset-t.start.offset,r),this.addFailure(this.createFailure(t.start.offset,t.end.offset-t.start.offset,a,n));else if("ng-switch"===e.name||"data-ng-switch"===e.name)a="Replace "+e.name+" with [ngSwitch]",i=this.removeDoubleBrace(e.value),r='[ngSwitch]="'+i+'"',n=this.createReplacement(t.start.offset,t.end.offset-t.start.offset,r),this.addFailure(this.createFailure(t.start.offset,t.end.offset-t.start.offset,a,n));else if("ng-switch-when"===e.name||"data-ng-switch-when"===e.name)a="Replace "+e.name+" with *ngSwitchWhen",n=this.createReplacement(t.start.offset,e.name.length,"*ngSwitchWhen"),this.addFailure(this.createFailure(t.start.offset,t.end.offset-t.start.offset,a,n));else if("ng-switch-default"===e.name||"data-ng-switch-default"===e.name)a="Replace "+e.name+" with *ngSwitchDefault",n=this.createReplacement(t.start.offset,e.name.length,"*ngSwitchDefault"),this.addFailure(this.createFailure(t.start.offset,t.end.offset-t.start.offset,a,n));else if("ng-repeat"===e.name||"data-ng-repeat"===e.name){a="Replace "+e.name+" with *ngFor";var s=/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/,o=e.value,c=o.match(s);i=!c||c[3]||c[4]?o:"let "+c[1]+" of "+c[2],r='*ngFor="'+i+'"',n=this.createReplacement(t.start.offset,t.end.offset-t.start.offset,r),this.addFailure(this.createFailure(t.start.offset,t.end.offset-t.start.offset,a,n))}else if("ng-bind-html"===e.name||"data-ng-bind-html"===e.name)a="Replace "+e.name+" with [innerHtml]",n=this.createReplacement(t.start.offset,e.name.length,"[innerHtml]"),this.addFailure(this.createFailure(t.start.offset,t.end.offset-t.start.offset,a,n));else if("ng-bind"===e.name||"data-ng-bind"===e.name)a="Replace "+e.name+" with [innerText]",n=this.createReplacement(t.start.offset,e.name.length,"[innerText]"),this.addFailure(this.createFailure(t.start.offset,t.end.offset-t.start.offset,a,n));else if("ng-model-options"===e.name||"data-ng-model-options"===e.name)a="Replace "+e.name+" with [ngModelOptions]",n=this.createReplacement(t.start.offset,e.name.length,"[ngModelOptions]"),this.addFailure(this.createFailure(t.start.offset,t.end.offset-t.start.offset,a,n));else if("ng-include"===e.name||"data-ng-include"===e.name)a="Replace "+e.name+" with include",n=this.createReplacement(t.start.offset,e.name.length,"include"),this.addFailure(this.createFailure(t.start.offset,t.end.offset-t.start.offset,a,n));else if("ng-controller"===e.name||"data-ng-controller"===e.name)a="Replace "+e.name+" with controller",n=this.createReplacement(t.start.offset,e.name.length,"controller"),this.addFailure(this.createFailure(t.start.offset,t.end.offset-t.start.offset,a,n));else if(f[e.name]){var l=f[e.name];a="Replace "+e.name+" with "+l,n=this.createReplacement(t.start.offset,e.name.length,l),this.addFailure(this.createFailure(t.start.offset,t.end.offset-t.start.offset,a,n))}},t.prototype.visitElementProperty=function(e,t){var r=e.sourceSpan;this.createReplace(e,r),this.createRemoveCtrlFailed(e.value.source,e.value)},t.prototype.removeDoubleBrace=function(e){if("string"==typeof e)return e&&e.startsWith("{{")&&e.endsWith("}}")?e.replace(/[\{\}]+/g,"").trim():e;var t=e.source;return t&&t.startsWith("{{")&&t.endsWith("}}")?t.replace(/[\{\}]+/g,"").trim():t},t.prototype.createRemoveCtrlFailed=function(e,t){var r=new RegExp(/\$ctrl./g);if(e&&t.start&&r.test(e)){var n=e.replace(r,""),a=this.createReplacement(t.start.offset,t.end.offset-t.start.offset,n);this.addFailure(this.createFailure(t.start.offset,t.end.offset-t.start.offset,"Remove '$ctrl.'",a))}},t.prototype.createRemoveCtrlFailedForAttr=function(e,t,r){var n=new RegExp(/\$ctrl./g);if(e&&n.test(e)){var a=e.replace(n,""),i='="'+a+'"',s=this.createReplacement(r.start.offset+t.length,r.end.offset-r.start.offset-t.length,i);this.addFailure(this.createFailure(r.start.offset+t.length,r.end.offset-r.start.offset-+t.length,"Remove '$ctrl.'",s))}},t}(c.BasicTemplateAstVisitor),d=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.currentImportsBlock=new m,t}return n(t,e),t.prototype.visitPropertyAccessExpression=function(t){var r=t.expression.getText();if(r&&"$scope"===r.trim()){var n="Replace '$scope' with 'this'",i=t.expression.getEnd()-t.expression.getStart(),s=this.createReplacement(t.expression.getStart(),i,r.replace("$scope","this"));this.addFailure(this.createFailure(t.expression.getStart(),i,n,s))}else if(r&&/\$asyncValidators/g.test(r.trim())){var o=t.getEnd()-t.getStart(),c=null;if(t.parent&&t.parent.kind===a.SyntaxKind.BinaryExpression){var l=t.parent;!l.right||l.right.kind!==a.SyntaxKind.FunctionExpression&&l.right.kind!==a.SyntaxKind.ArrowFunction||(c=l.right)}var n="Replace '$asyncValidators' with AsyncValidator",u=[],s=this.createReplacement(t.getStart(),t.parent.getEnd()-t.getStart()+1,"");u.push(s),this.createImportReplacement("AbstractControl, NG_ASYNC_VALIDATORS,ValidationErrors, AsyncValidator","@angular/forms",u),this.createImplementsReplace(u,"AsyncValidator"),this.createAsycMethodReplacement(u,c,!0),this.createPropertyReplacement(u,"NG_ASYNC_VALIDATORS"),this.addFailure(this.createFailure(t.getStart(),o,n,u))}else if(r&&/\$validators/g.test(r.trim())){var p=t.getEnd()-t.getStart(),c=null;if(t.parent&&t.parent.kind===a.SyntaxKind.BinaryExpression){var f=t.parent;!f.right||f.right.kind!==a.SyntaxKind.FunctionExpression&&f.right.kind!==a.SyntaxKind.ArrowFunction||(c=f.right)}var n="Replace '$validators' with Validator",u=[],s=this.createReplacement(t.getStart(),t.parent.getEnd()-t.getStart()+1,"");u.push(s),this.createImportReplacement("AbstractControl, NG_VALIDATORS,ValidationErrors, Validator","@angular/forms",u),this.createImplementsReplace(u,"Validator"),this.createAsycMethodReplacement(u,c,!1),this.createPropertyReplacement(u,"NG_VALIDATORS"),this.addFailure(this.createFailure(t.getStart(),p,n,u))}e.prototype.visitPropertyAccessExpression.call(this,t)},t.prototype.visitClassDeclaration=function(t){var r=this;if(t.members.forEach(function(e){r.currentImportsBlock.addClassDeclaration(r.getSourceFile(),e)}),this.currentImportsBlock.setClassName(t.name.getText()),t.heritageClauses&&t.heritageClauses.length>0){t.heritageClauses.forEach(function(e){e.types.forEach(function(e){var t=e.getStart(),n=e.getEnd();r.currentImportsBlock.addLastImplements(r.getSourceFile(),t,n,e.getText())})});var n=this.currentImportsBlock.getLastImplement().nodeStartOffset,a=this.currentImportsBlock.getLastImplement().nodeEndOffset;this.currentImportsBlock.addLastImplements(this.getSourceFile(),n,a," ,")}else{var n=t.name.getStart(),a=t.name.getEnd();this.currentImportsBlock.addLastImplements(this.getSourceFile(),n,a," implements")}e.prototype.visitClassDeclaration.call(this,t)},t.prototype.visitMethodDeclaration=function(t){var r=[];if("onInit"===t.name.getText()){var n="Replace onInit with ngOnInit",a=t.name.getEnd()-t.name.getStart(),i=this.createReplacement(t.name.getStart(),a,"ngOnInit");r.push(i);var s=this.currentImportsBlock.hasImportWithName("OnInit"),o=this.currentImportsBlock.hasImplement("OnInit");s||this.createImportReplacement("OnInit","@angular/core",r),o||this.createImplementsReplace(r,"OnInit"),this.addFailure(this.createFailure(t.name.getStart(),a,n,r))}else if("onDestroy"===t.name.getText()){var n="Replace onDestroy with ngOnDestroy",c=t.name.getEnd()-t.name.getStart(),i=this.createReplacement(t.name.getStart(),c,"ngOnDestroy");r.push(i);var s=this.currentImportsBlock.hasImportWithName("OnDestroy"),o=this.currentImportsBlock.hasImplement("OnDestroy");s||this.createImportReplacement("OnDestroy","@angular/core",r),o||this.createImplementsReplace(r,"OnDestroy"),this.addFailure(this.createFailure(t.name.getStart(),c,n,r))}else if("onChanges"===t.name.getText()){var n="Replace onChanges with ngOnChanges",l=t.name.getEnd()-t.name.getStart(),i=this.createReplacement(t.name.getStart(),l,"ngOnChanges");r.push(i);var s=this.currentImportsBlock.hasImportWithName("OnChanges"),o=this.currentImportsBlock.hasImplement("OnChanges");s||this.createImportReplacement("OnChanges","@angular/core",r),o||this.createImplementsReplace(r,"OnChanges"),this.addFailure(this.createFailure(t.name.getStart(),l,n,r))}e.prototype.visitMethodDeclaration.call(this,t)},t.prototype.print=function(e){var t=a.createPrinter({newLine:a.NewLineKind.LineFeed});return a.isSourceFile(e)?t.printFile(e):(null!=e.getSourceFile&&null!=e.getSourceFile()||(e.getSourceFile=function(){return{text:""}}),t.printNode(a.EmitHint.Unspecified,e,e.getSourceFile()))},t.prototype.visitCallExpression=function(t){var r=this,n=this.print(t.expression),i=[];if(t.expression.kind===a.SyntaxKind.PropertyAccessExpression){var s=t.expression.name;if("$on"===s.text){var o=[];t.arguments.forEach(function(e){if("'$viewContentLoaded'"===e.getFullText()?o.push("viewContentLoaded"):"'$locationChangeSuccess'"===e.getFullText()&&o.push("locationChangeSuccess"),o.indexOf("viewContentLoaded")>-1&&e.kind===a.SyntaxKind.FunctionExpression){var n="Replace $viewContentLoaded with AfterViewInit",s=t.getEnd()-t.getStart(),c=r.createReplacement(t.getStart(),s+1,"");i.push(c),r.createImportReplacement("AfterViewInit","@angular/core",i),r.createImplementsReplace(i,"AfterViewInit"),e.kind===a.SyntaxKind.FunctionExpression?r.createMethodReplacement(i,e):(e.kind,a.SyntaxKind.Identifier),r.addFailure(r.createFailure(t.getStart(),s,n,i))}else if(o.indexOf("locationChangeSuccess")>-1&&e.kind===a.SyntaxKind.Identifier){var n="Replace $locationChangeSuccess with pipe",l=t.getEnd()-t.getStart();r.createImportReplacement("Subscription","rxjs",i),r.createImportEnterReplacement(i),r.createImportReplacement("filter","rxjs/operators",i),r.createImportEnterReplacement(i),r.createImportReplacement("Router,NavigationEnd","@angular/router",i);var c=r.createReplacement(t.getStart(),l,"this.subscription = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {\n            this."+e.getText()+"();\n        })");i.push(c),r.addFailure(r.createFailure(t.getStart(),l,n,i))}})}else s.text}if(t.expression&&"$location.path"===n.trim()){var c="Replace $location with router",l=t.getEnd()-t.getStart(),u=0==t.arguments.length,p=u?this.createReplacement(t.expression.getStart(),l,n.replace("$location.path","this.router.url")):this.createReplacement(t.expression.getStart(),n.trim().length,n.replace("$location.path","this.router.navigateByUrl"));i.push(p),this.createImportReplacement("Router","@angular/router",i),this.addReplacements(i),this.addFailure(this.createFailure(t.expression.getStart(),l,c,i))}else if(t.expression&&"$window.open"===n.trim()){var c="Replace $window.open with router",f=t.expression.getEnd()-t.expression.getStart(),p=this.createReplacement(t.expression.getStart(),f,n.replace("$window.open","this.router.navigateByUrl"));i.push(p),this.createImportReplacement("Router","@angular/router",i),this.addReplacements(i),this.addFailure(this.createFailure(t.expression.getStart(),f,c,i))}else if(t.expression&&"$state.go"===n.trim()){var c="Replace $state.go with router",h=t.getEnd()-t.expression.getStart(),d="";t.arguments.forEach(function(e){if(e.kind===a.SyntaxKind.StringLiteral){d="/"+e.text}});var p=this.createReplacement(t.expression.getStart(),h,n.replace("$state.go","this.router.navigate(['"+d+"'])"));i.push(p),this.createImportReplacement("Router","@angular/router",i),this.addReplacements(i),this.addFailure(this.createFailure(t.expression.getStart(),h,c,i))}else t.expression&&"Directive"===n.trim()&&t.arguments.forEach(function(e){if(e.kind===a.SyntaxKind.ObjectLiteralExpression){e.properties.forEach(function(e){r.currentImportsBlock.addLastPropertis(r.getSourceFile(),e.getStart(),e.getEnd(),e.name.getText())})}});e.prototype.visitCallExpression.call(this,t)},t.prototype.createImportReplacement=function(e,t,r){var n="import { "+e+" } from '"+t+"';";if(this.currentImportsBlock.hasImport(t)){var a=this.currentImportsBlock.getInsertLocation(e,t);if(0!==a){var i=this.appendText(a,", "+e);r.push(i)}}else{var i=this.appendText(this.currentImportsBlock.getLastImportDeclaration().nodeEndOffset,n);r.push(i)}},t.prototype.createImportEnterReplacement=function(e){var t=this.appendText(this.currentImportsBlock.getLastImportDeclaration().nodeEndOffset,"\n");e.push(t)},t.prototype.createPropertyReplacement=function(e,t){if(!this.currentImportsBlock.hasProperty("providers")){var r=this.currentImportsBlock.getClassName(),n=" ,\n providers: [{ provide: "+t+", useExisting: "+r+", multi: true }]",a=this.currentImportsBlock.getLastPropery(),i=this.appendText(a.nodeEndOffset,n);e.push(i)}},t.prototype.createImplementsReplace=function(e,t){var r=this.currentImportsBlock.getLastImplement();if(r){var n=this.appendText(r.nodeEndOffset,r.text+" "+t);e.push(n)}},t.prototype.createMethodReplacement=function(e,t){var r=this.currentImportsBlock.getLastClassDeclaration();if(r){var n=t.body.getFullText(),a=this.appendText(r.nodeEndOffset,"\n    ngAfterViewInit(): void "+n);e.push(a)}},t.prototype.createAsycMethodReplacement=function(e,t,r){var n=this.currentImportsBlock.getLastClassDeclaration();if(n&&t){var a=t.body.getFullText(),i=r?this.appendText(n.nodeEndOffset,"\n     validate(control: AbstractControl): Promise<ValidationErrors> "+a):this.appendText(n.nodeEndOffset,"\n     validate(control: AbstractControl): ValidationErrors "+a);e.push(i)}},t.prototype.addReplacements=function(e){if(this.currentImportsBlock.getLastConstructorDeclaration()&&!this.currentImportsBlock.hasRouteConstructor()){var t=this.appendText(this.currentImportsBlock.getLastConstructorDeclaration().nodeEndOffset,", private router: Router");e.push(t)}else if(this.currentImportsBlock.getConstractorWithoutParameter()){var t=this.appendText(this.currentImportsBlock.getConstractorWithoutParameter().nodeEndOffset," private router: Router");e.push(t)}},t.prototype.visitImportDeclaration=function(t){var r=t.moduleSpecifier.getText();this.currentImportsBlock.addImportDeclaration(this.getSourceFile(),t,r),e.prototype.visitImportDeclaration.call(this,t)},t.prototype.visitConstructorDeclaration=function(t){var r=t.parameters;if(r.length>0)for(var n=0,a=r;n<a.length;n++){var i=a[n];null!=i.modifiers&&i.modifiers.length>0&&this.currentImportsBlock.addConstructorDeclaration(this.getSourceFile(),i,i.type.getFullText(),i.name.text)}else this.currentImportsBlock.addConstractorWithoutParameters(t);e.prototype.visitConstructorDeclaration.call(this,t)},t}(i.RuleWalker);t.AngularDocRule=d;var m=function(){function e(){this.importDeclarations=[],this.constructorDeclarations=[],this.contractors=[],this.classDeclarations=[],this.implementkeys=[],this.propertyKeys=[],this.className=""}return e.prototype.addImportDeclaration=function(e,t,r){var n=this.getStartOffset(t),a=this.getEndOffset(e,t),i=e.text.substring(n,a);if(n>t.getStart()||0===a)return void(this.importDeclarations=[]);this.importDeclarations.push({node:t,nodeEndOffset:a,nodeStartOffset:n,sourcePath:r,text:i})},e.prototype.addClassDeclaration=function(e,t){var r=t.getStart(),n=t.getEnd();this.classDeclarations.push({node:t,nodeEndOffset:n,nodeStartOffset:r})},e.prototype.addLastImplements=function(e,t,r,n){this.implementkeys.push({nodeEndOffset:r,nodeStartOffset:t,text:n})},e.prototype.addLastPropertis=function(e,t,r,n){this.propertyKeys.push({nodeEndOffset:r,nodeStartOffset:t,name:n})},e.prototype.getLastPropery=function(){return this.propertyKeys[this.propertyKeys.length-1]},e.prototype.getLastImplement=function(){return this.implementkeys[this.implementkeys.length-1]},e.prototype.hasImplement=function(e){return this.implementkeys.filter(function(t){return t.text===e}).length>0},e.prototype.getLastClassDeclaration=function(){return this.classDeclarations[this.classDeclarations.length-1]},e.prototype.addConstructorDeclaration=function(e,t,r,n){var a=t.getStart(),i=t.getEnd();this.constructorDeclarations.push({nodeEndOffset:i,nodeStartOffset:a,type:r,name:n})},e.prototype.addConstractorWithoutParameters=function(e){var t=e.parameters.pos,r=e.parameters.end;this.contractors.push({nodeStartOffset:t,nodeEndOffset:r,node:e})},e.prototype.getConstractorWithoutParameter=function(){return this.contractors[0]},e.prototype.hasImport=function(e){return this.importDeclarations.filter(function(t){return t.sourcePath==="'"+e+"'"}).length>0},e.prototype.hasImportWithName=function(e){return this.importDeclarations.filter(function(t){return new RegExp(e,"g").test(t.text)}).length>0},e.prototype.hasProperty=function(e){return this.propertyKeys.filter(function(t){return t.name===e}).length>0},e.prototype.getInsertLocation=function(e,t){var r=this.importDeclarations.filter(function(e){return e.sourcePath==="'"+t+"'"});if(r.length>0){var n=r[0].node,a=n.importClause,i=a.namedBindings;return i.elements.filter(function(t){return t.name.text===e}).length>0?0:i.elements[0].getEnd()}},e.prototype.hasRouteConstructor=function(){return this.constructorDeclarations.filter(function(e){return"Router"===e.type.trim()}).length>0},e.prototype.getLastImportSource=function(){return 0===this.importDeclarations.length?null:this.getLastImportDeclaration().sourcePath},e.prototype.getStartOffset=function(e){return 0===this.importDeclarations.length?e.getStart():this.getLastImportDeclaration().nodeEndOffset},e.prototype.getEndOffset=function(e,t){return e.text.indexOf("\n",t.end)+1},e.prototype.getLastImportDeclaration=function(){return this.importDeclarations[this.importDeclarations.length-1]},e.prototype.getLastConstructorDeclaration=function(){return this.constructorDeclarations[this.constructorDeclarations.length-1]},e.prototype.setClassName=function(e){this.className=e},e.prototype.getClassName=function(){return this.className},e}(),g=function(){function e(){}return e.prototype.checkNg1Template=function(e,t,r){var n={ruleName:"check-ng1-template-attribute",ruleArguments:["ng1-template"],disabledIntervals:null,ruleSeverity:"error"},i="src",c=o.join(e,".angular-cli.json");if(s.existsSync(c)){var f=s.readFileSync(c,"utf-8"),m=JSON.parse(f),g=m.apps[0].root;g&&(i=g)}if(c=o.join(e,"angular.json"),s.existsSync(c)){var f=s.readFileSync(c,"utf-8"),m=JSON.parse(f);if(m.projects)for(var v=Object.keys(m.projects),y=0,R=v;y<R.length;y++){var S=R[y];if("application"===m.projects[S].projectType){var g=m.projects[S].sourceRoot;g&&(i=g)}}}if(o.relative(e,t).startsWith(i)&&t.endsWith(".html")){var x=this.getContextSourceFile(t,r),F=u.parseTemplate(r),w=(new p.ReferenceCollectorVisitor,{template:{template:{code:r,source:r,url:t},url:t,node:null}}),I=new h(x,n,w,0);try{F.forEach(function(e){return I.visit(e,w)})}catch(e){console.log(e)}var k=I.getFailures();return k}var D=a.createSourceFile(t,r,a.ScriptTarget.Latest,!0),C=new l.NgWalker(D,n,{templateVisitorCtrl:h});C.walk(D);var k=C.getFailures();k=k.filter(function(e){return e.getFileName()===t});var O=new d(D,n);O.walk(D);var E=O.getFailures();return k.concat(E)},e.prototype.getContextSourceFile=function(e,t){var r=a.createSourceFile(e,"`"+t+"`",a.ScriptTarget.ES5),n=r.getFullText;return r.getFullText=function(){var e=n.apply(r);return e.substring(1,e.length-1)}.bind(r),r},e}();t.MatchNg1Template=g},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function e(e){this.defaultDelay=e,this.timeout=null,this.completionPromise=null,this.onSuccess=null,this.task=null}return e.prototype.trigger=function(e,t){var r=this;return void 0===t&&(t=this.defaultDelay),this.task=e,this.cancelTimeout(),this.completionPromise||(this.completionPromise=new Promise(function(e){r.onSuccess=e}).then(function(){r.completionPromise=null,r.onSuccess=null;var e=r.task();return r.task=null,e})),this.completionPromise||(this.completionPromise=new Promise(function(e){r.onSuccess=e}).then(function(){r.completionPromise=null,r.onSuccess=null;var e=r.task;return r.task=null,e()})),this.timeout=setTimeout(function(){r.timeout=null,r.onSuccess(null)},t),this.completionPromise},e.prototype.isTriggered=function(){return null!==this.timeout},e.prototype.cancel=function(){this.cancelTimeout(),this.completionPromise=null},e.prototype.cancelTimeout=function(){null!==this.timeout&&(clearTimeout(this.timeout),this.timeout=null)},e}();t.Delayer=n},function(e,t){e.exports=require("url")},function(e,t){e.exports=require("vscode-languageserver")},function(e,t,r){"use strict";function n(e,t){var r=C[e.uri];r||(r=new x.Delayer(200),C[e.uri]=r),r.trigger(function(){a(w,e,t),delete C[e.uri]})}function a(e,t,r){try{var n=t.uri;if(b){var a=i(e,t,r);e.sendDiagnostics({uri:n,diagnostics:a})}}catch(e){}}function i(e,t,r){var n=t.uri,a=[];delete O[n];var i=t.getText(),l=(new S.MatchNg1Template).checkNg1Template(k,r,i);return l&&l.length>0&&(a=s(r,l).map(function(e){var r=o(e);return c(t,r,e),r})),a}function s(e,t){var r=R.normalize(e),n={};return t.filter(function(e){var t=e.getFileName();return n[t]||(n[t]=R.normalize(t)),n[t]===r})}function o(e){return{severity:1,message:e.getFailure(),range:{start:{line:e.getStartPosition().getLineAndCharacter().line,character:e.getStartPosition().getLineAndCharacter().character},end:{line:e.getEndPosition().getLineAndCharacter().line,character:e.getEndPosition().getLineAndCharacter().character}},source:"AngularDoc"}}function c(e,t,r){var n=null;if(r.getFix&&r.getFix()&&(n=u(r,e)),n){var a=O[e.uri];a||(a=Object.create(null),O[e.uri]=a),a[l(t)]=n}}function l(e){var t=e.range;return"["+t.start.line+","+t.start.character+","+t.end.line+","+t.end.character+"]-"+e.code}function u(e,t){var r=[];if(e.getFix&&e.getFix()){var n=e.getFix();Array.isArray(n)||(n=[n]),r=n.map(function(e){return p(t,e)})}return{label:"Fix: "+e.getFailure(),documentVersion:t.version,problem:e,edits:r}}function p(e,t){return{range:[e.positionAt(t.start),e.positionAt(t.end)],text:t.text}}function f(e){return e.edits.map(function(e){return v.TextEdit.replace(v.Range.create(e.range[0],e.range[1]),e.text||"")})}function h(e){var t=F.parse(e);switch(t.protocol){case"file:":case"private:":var r=unescape(t.path);return r.match(/^\/\w:/)&&(r=r.substr(1)),r}}function d(e){return e.sort(function(e,t){var r=e.edits[0],n=t.edits[0];return r.range[0]<n.range[0]?-1:r.range[0]>n.range[0]?1:r.range[1]<n.range[1]?-1:r.range[1]>n.range[1]?1:0})}function m(e,t){if(!e)return!1;var r=!1;return e.edits.some(function(e){return t.edits.some(function(t){return e.range[1].line>t.range[0].line?(r=!0,!0):!(e.range[1].line<t.range[0].line)&&(e.range[1].character>=t.range[0].character&&(r=!0,!0))})}),r}function g(e){var t=[];return e.forEach(function(e){t=t.concat(f(e))}),t}Object.defineProperty(t,"__esModule",{value:!0});var v=r(5),y=r(1),R=r(0),S=r(2),x=r(3),F=r(4),w=v.createConnection(new v.IPCMessageReader(process),new v.IPCMessageWriter(process)),I=new v.TextDocuments;I.listen(w);var k,D,C=new Map,O=(new Map,new Map),E=(new Map,!1),b=!1;w.onInitialize(function(e){return console.log("Initializing AngularDoc server..."),k=e.rootPath,D=e.initializationOptions,E=!0,{capabilities:{textDocumentSync:I.syncKind,codeActionProvider:!0}}}),w.onRequest(y.MigrationRepoNotification.metadata,function(e){b=e.isMigration}),I.onDidSave(function(e){var t=h(e.document.uri);t&&n(e.document,t)}),I.onDidOpen(function(e){var t=h(e.document.uri);t&&n(e.document,t)}),I.onDidChangeContent(function(e){var t=h(e.document.uri);t&&n(e.document,t)}),I.onDidClose(function(e){w.sendDiagnostics({uri:e.document.uri,diagnostics:[]})}),w.onCodeAction(function(e){var t=[],r=e.textDocument.uri,n=-1,a=O[r];if(a){for(var i=0,s=e.context.diagnostics;i<s.length;i++){var o=s[i],c=a[l(o)];c&&(n=c.documentVersion,t.push(v.Command.create(c.label,"angulardoc.applySingleFix",r,n,f(c))))}if(t.length>0){var u=new Map,p=[],h=Object.keys(a).map(function(e){return a[e]});h=d(h);for(var m=0,y=h;m<y.length;m++){var R=y[m];-1===n&&(n=R.documentVersion);var S=R.problem.getFailure();if("Replace $location with router"!==S&&"Replace $window.open with router"!==S&&"Replace $state.go with router"!==S)if(u.get(S))u.get(S).push(R);else{var x=[];x.push(R),u.set(S,x)}p.push(R)}u.forEach(function(e,a){e.length>1&&t.push(v.Command.create("Fix all: "+a,"angulardoc.applySameFixes",r,n,g(e)))}),p.length>1&&t.push(v.Command.create("Fix all auto-fixable problems","angulardoc.applyAllFixes",r,n,g(p)))}}return t}),t.overlaps=m,w.listen()},function(e,t){e.exports=require("codelyzer/angular/ngWalker")},function(e,t){e.exports=require("codelyzer/angular/templates/basicTemplateAstVisitor")},function(e,t){e.exports=require("codelyzer/angular/templates/referenceCollectorVisitor")},function(e,t){e.exports=require("codelyzer/angular/templates/templateParser")},function(e,t){e.exports=require("fs")},function(e,t){e.exports=require("tslint")},function(e,t){e.exports=require("typescript")}]);