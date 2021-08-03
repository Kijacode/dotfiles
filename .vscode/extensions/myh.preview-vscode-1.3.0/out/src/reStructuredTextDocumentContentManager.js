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
const docutilsUtil_1 = require("./utils/docutilsUtil");
let rst2mdown = require("rst2mdown");
let markdown = require("markdown").markdown;
var _instance = null;
function getInstance() {
    if (!_instance) {
        _instance = new ReStructuredTextDocumentContentManager();
    }
    return _instance;
}
exports.getInstance = getInstance;
class ReStructuredTextDocumentContentManager {
    // 生成当前编辑页面的可预览代码片段
    // @Override
    createContentSnippet() {
        return __awaiter(this, void 0, void 0, function* () {
            let editor = vscode_1.window.activeTextEditor;
            if (!editor) {
                return htmlUtil_1.HtmlUtil.errorSnippet(this.getWindowErrorMessage());
            }
            if (editor.document.languageId !== "rst") {
                return htmlUtil_1.HtmlUtil.errorSnippet(this.getErrorMessage());
            }
            return this.generatePreviewSnippet(editor);
        });
    }
    // @Override
    sendPreviewCommand(previewUri, displayColumn) {
        return htmlUtil_1.HtmlUtil.sendPreviewCommand(previewUri, displayColumn);
    }
    getErrorMessage() {
        return `Active editor doesn't show a ReStructured Text document (.rst|.rest|.hrst)- no properties to preview.`;
    }
    getWindowErrorMessage() {
        return `No Active editor - no properties to preview.`;
    }
    rstSrcSnippetWithNodeModules(rstContent) {
        return markdown.toHTML(rst2mdown(rstContent));
    }
    rstSrcSnippetWithDocutils(editor) {
        if (!editor || !editor.document) {
            return Promise.resolve(htmlUtil_1.HtmlUtil.errorSnippet(this.getWindowErrorMessage()));
        }
        // 获取当前编辑页面对应的文档
        let doc = editor.document;
        return docutilsUtil_1.DocutilsUtil.rst2html(doc.fileName);
    }
    rstSrcSnippet(editor) {
        if (!editor) {
            return Promise.resolve(htmlUtil_1.HtmlUtil.errorSnippet(this.getWindowErrorMessage()));
        }
        let thiz = this;
        return this.rstSrcSnippetWithDocutils(editor).catch(function (error) {
            console.error("we got an error: " + error);
            vscode_1.window.showWarningMessage("try rst2html of doctutils failed, please check python and doctuils environment, we use a simple preview instead ^-)");
            if (!editor.document) {
                return Promise.resolve(htmlUtil_1.HtmlUtil.errorSnippet(this.getWindowErrorMessage()));
            }
            return thiz.rstSrcSnippetWithNodeModules(editor.document.getText());
        });
    }
    // 生成预览编辑页面
    generatePreviewSnippet(editor) {
        if (!editor || !editor.document) {
            return Promise.resolve(htmlUtil_1.HtmlUtil.errorSnippet(this.getWindowErrorMessage()));
        }
        // 获取当前编辑页面对应的文档
        let doc = editor.document;
        return this.rstSrcSnippet(editor).then(function (rstSrc) {
            return htmlUtil_1.HtmlUtil.fixNoneNetLinks(rstSrc, doc.fileName);
        });
    }
}
//# sourceMappingURL=reStructuredTextDocumentContentManager.js.map