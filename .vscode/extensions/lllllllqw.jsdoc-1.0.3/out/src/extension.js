"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const main_1 = require("./main");
function activate(context) {
    const disposable = vscode.commands.registerCommand('extension.genJSDoc', main_1.genJSDoc);
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map