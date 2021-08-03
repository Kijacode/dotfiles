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
exports.deactivate = exports.activate = void 0;
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable curly */
const vscode_1 = require("vscode");
const composables_1 = require("./composables");
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        // Preview the readme file
        let view = vscode_1.commands.registerCommand('auto-view-readme.view', () => __awaiter(this, void 0, void 0, function* () {
            let current = composables_1.currentPath();
            if (!current)
                return vscode_1.window.showErrorMessage("No folder or file open.");
            // Find readme candidate
            let readme = yield composables_1.recursivelyFindReadme(current);
            if (!readme)
                return vscode_1.window.showErrorMessage("No readme found.");
            // Show preview of readme
            yield vscode_1.commands.executeCommand('markdown.showPreview', readme);
        }));
        // Open the readme file only, no preview
        let open = vscode_1.commands.registerCommand('auto-view-readme.open', () => __awaiter(this, void 0, void 0, function* () {
            let current = composables_1.currentPath();
            if (!current)
                return vscode_1.window.showErrorMessage("No folder or file open.");
            // Find readme candidate
            let readme = yield composables_1.recursivelyFindReadme(current);
            if (!readme)
                return vscode_1.window.showErrorMessage("No readme found.");
            // Open readme
            yield vscode_1.commands.executeCommand('vscode.open', readme);
        }));
        // Open the readme file with the preview to the side of the editor
        let openWithPreview = vscode_1.commands.registerCommand('auto-view-readme.openWithPreview', () => __awaiter(this, void 0, void 0, function* () {
            let current = composables_1.currentPath();
            if (!current)
                return vscode_1.window.showErrorMessage("No folder or file open.");
            // Find readme candidate
            let readme = yield composables_1.recursivelyFindReadme(current);
            if (!readme)
                return vscode_1.window.showErrorMessage("No readme found.");
            // Open readme
            yield vscode_1.commands.executeCommand('vscode.open', readme);
            // Show preview to side
            yield vscode_1.commands.executeCommand('markdown.showPreviewToSide');
        }));
        context.subscriptions.push(view, open, openWithPreview);
    });
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
    /**
     *
     * Remove commands here
     * Do we need to?
     *
     */
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map