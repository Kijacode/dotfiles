"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
let fileUrl = require("file-url");
class MermaidUtil {
    // @Override
    static sendPreviewCommand(previewUri, command) {
        if (command != this.COMMAND_BUTT) {
            return vscode_1.commands.executeCommand(command).then((success) => {
            }, (reason) => {
                console.warn(reason);
                vscode_1.window.showErrorMessage(reason);
            });
        }
    }
    static isMermaidFile(editor) {
        if (!editor || !editor.document || !editor.document.fileName) {
            return false;
        }
        if (editor.document.fileName.toLowerCase().endsWith(".mermaid")) {
            return true;
        }
        return false;
    }
}
MermaidUtil.COMMAND = "vscode.previewHtml";
MermaidUtil.COMMAND_BUTT = "";
exports.MermaidUtil = MermaidUtil;
//# sourceMappingURL=mermaidUtil.js.map