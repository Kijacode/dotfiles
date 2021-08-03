"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const generateReadme_1 = require("./commands/generateReadme");
function activate(context) {
    let disposable = vscode.commands.registerCommand('Readme.generate', generateReadme_1.generateReadme);
    context.subscriptions.push(disposable);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map