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
const htmlUtil_1 = require("./utils/htmlUtil");
let fileUrl = require("file-url");
var _instance = null;
function getInstance() {
    if (!_instance) {
        _instance = new HtmlDocumentContentManager();
    }
    return _instance;
}
exports.getInstance = getInstance;
class HtmlDocumentContentManager {
    // 生成当前编辑页面的HTML代码片段
    // @Override
    createContentSnippet() {
        return __awaiter(this, void 0, void 0, function* () {
            let editor = vscode_1.window.activeTextEditor;
            if (!editor || !editor.document) {
                return htmlUtil_1.HtmlUtil.errorSnippet(this.getWindowErrorMessage());
            }
            if (editor.document.languageId !== "html" && editor.document.languageId !== "jade") {
                return htmlUtil_1.HtmlUtil.errorSnippet("Active editor doesn't show a HTML or Jade document - no properties to preview.");
            }
            let previewSnippet = this.generatePreviewSnippet(editor);
            if (!previewSnippet || previewSnippet.length <= 0) {
                return htmlUtil_1.HtmlUtil.errorSnippet(this.getErrorMessage());
            }
            console.info("previewSnippet = " + previewSnippet);
            return previewSnippet;
        });
    }
    // @Override
    sendPreviewCommand(previewUri, displayColumn) {
        return htmlUtil_1.HtmlUtil.sendPreviewCommand(previewUri, displayColumn);
    }
    getErrorMessage() {
        return `Active editor doesn't show a HTML document - no properties to preview.`;
    }
    getWindowErrorMessage() {
        return `No Active editor - no properties to preview.`;
    }
    // 生成预览编辑页面
    // @Override
    generatePreviewSnippet(editor) {
        if (!editor || !editor.document) {
            return htmlUtil_1.HtmlUtil.errorSnippet("No Active editor - no properties to preview.");
        }
        // 获取当前编辑页面对应的文档
        let doc = editor.document;
        return htmlUtil_1.HtmlUtil.createLocalSource(htmlUtil_1.SourceType.STYLE, "header_fix.css") +
            htmlUtil_1.HtmlUtil.createRemoteSource(htmlUtil_1.SourceType.BR) +
            htmlUtil_1.HtmlUtil.fixNoneNetLinks(doc.getText(), doc.fileName);
    }
}
//# sourceMappingURL=htmlDocumentContentManager.js.map