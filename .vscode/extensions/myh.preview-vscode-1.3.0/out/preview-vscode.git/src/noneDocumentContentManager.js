"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
var _instance = null;
function getInstance() {
    if (!_instance) {
        _instance = new NoneDocumentContentManager();
    }
    return _instance;
}
exports.getInstance = getInstance;
class NoneDocumentContentManager {
    // 生成当前编辑页面的可预览代码片段
    // @Override
    createContentSnippet() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getErrorMessage();
        });
    }
    // @Override
    sendPreviewCommand(previewUri, displayColumn) {
        vscode_1.window.showWarningMessage(this.getErrorMessage());
        return;
    }
    getErrorMessage() {
        return "Couldn't determine type to preivew, please choose.";
    }
}
//# sourceMappingURL=noneDocumentContentManager.js.map