"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.promptForNodeExpressFile = exports.promptForFolderToServe = exports.promptForPort = void 0;
const vscode = require("vscode");
function promptForPort() {
    return __awaiter(this, void 0, void 0, function* () {
        var opt = {
            placeHolder: '3000',
            prompt: 'What port does your app listen on?',
            value: '3000'
        };
        return vscode.window.showInputBox(opt);
    });
}
exports.promptForPort = promptForPort;
function promptForFolderToServe() {
    return __awaiter(this, void 0, void 0, function* () {
        var opt = {
            placeHolder: './www',
            prompt: 'What folder shoud express serve?',
            value: './www'
        };
        return vscode.window.showInputBox(opt);
    });
}
exports.promptForFolderToServe = promptForFolderToServe;
function promptForNodeExpressFile() {
    return __awaiter(this, void 0, void 0, function* () {
        var opt = {
            placeHolder: 'index.js',
            prompt: 'What do you want to name the file?',
            value: 'index.js'
        };
        return vscode.window.showInputBox(opt);
    });
}
exports.promptForNodeExpressFile = promptForNodeExpressFile;
//# sourceMappingURL=prompts.js.map