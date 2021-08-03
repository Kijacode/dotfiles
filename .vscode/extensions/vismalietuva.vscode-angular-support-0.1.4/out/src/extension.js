'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const angular_ts_definition_provider_1 = require("./providers/angular-ts-definition-provider");
const angular_html_definition_provider_1 = require("./providers/angular-html-definition-provider");
function activate(context) {
    console.log('Congratulations, extension "vscode-angular-support" is now active!');
    context.subscriptions.push(vscode_1.languages.registerDefinitionProvider({ language: 'typescript', scheme: 'file' }, new angular_ts_definition_provider_1.AngularTsDefinitionProvider()));
    context.subscriptions.push(vscode_1.languages.registerDefinitionProvider({ language: 'html', scheme: 'file' }, new angular_html_definition_provider_1.AngularHtmlDefinitionProvider()));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map