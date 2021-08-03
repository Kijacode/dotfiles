"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const textUtil_1 = require("./textUtil");
let fileUrl = require("file-url");
var PreviewWindowType;
(function (PreviewWindowType) {
    PreviewWindowType[PreviewWindowType["OVERRIDE"] = 0] = "OVERRIDE";
    PreviewWindowType[PreviewWindowType["SIDE_BY_SIDE"] = 1] = "SIDE_BY_SIDE";
})(PreviewWindowType || (PreviewWindowType = {}));
class MarkDownUtil {
    // @Override
    static sendPreviewCommand(previewUri, displayColumn) {
        let command = MarkDownUtil.getPreviewCommandTag(displayColumn);
        if (command != this.COMMAND_BUTT) {
            return vscode_1.commands.executeCommand(command).then((success) => { }, (reason) => {
                console.warn(reason);
                vscode_1.window.showErrorMessage(reason);
            });
        }
    }
    static getPreviewCommandTag(displayColumn) {
        if (displayColumn == vscode_1.window.activeTextEditor.viewColumn) {
            return MarkDownUtil.getCommandTogglePreview();
        }
        return MarkDownUtil.getCommandOpenPreviewSideBySide();
    }
    static getCommandTogglePreview() {
        if (textUtil_1.TextUtil.versionCompare(vscode_1.version, "1.3.0") < 0) {
            return MarkDownUtil.COMMAND_TOGGLE_PREVIEW;
        }
        return MarkDownUtil.COMMAND_TOGGLE_PREVIEW_1_3_0;
    }
    static getCommandOpenPreviewSideBySide() {
        if (textUtil_1.TextUtil.versionCompare(vscode_1.version, "1.3.0") < 0) {
            return MarkDownUtil.COMMAND_OPEN_PREVIEW_SIDE_BY_SIDE;
        }
        return MarkDownUtil.COMMAND_OPEN_PREVIEW_SIDE_BY_SIDE_1_3_0;
    }
}
MarkDownUtil.COMMAND_TOGGLE_PREVIEW = "workbench.action.markdown.togglePreview";
MarkDownUtil.COMMAND_OPEN_PREVIEW_SIDE_BY_SIDE = "workbench.action.markdown.openPreviewSideBySide";
MarkDownUtil.COMMAND_TOGGLE_PREVIEW_1_3_0 = "markdown.showPreview";
MarkDownUtil.COMMAND_OPEN_PREVIEW_SIDE_BY_SIDE_1_3_0 = "markdown.showPreviewToSide";
MarkDownUtil.COMMAND_BUTT = "";
exports.MarkDownUtil = MarkDownUtil;
//# sourceMappingURL=markDownUtil.js.map