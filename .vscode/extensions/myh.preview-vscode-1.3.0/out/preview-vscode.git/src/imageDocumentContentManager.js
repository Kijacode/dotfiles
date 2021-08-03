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
const textUtil_1 = require("./utils/textUtil");
let fileUrl = require("file-url");
var _instance = null;
function getInstance() {
    if (!_instance) {
        _instance = new ImageDocumentContentManager();
    }
    return _instance;
}
exports.getInstance = getInstance;
class ImageDocumentContentManager {
    constructor() {
        this.COMMAND = "vscode.previewHtml";
        this.IMAGE_TYPE_REGREX_PREFFIX = /http[s]{0,1}:\/\/|file:\/\/|\s[\.]{0,2}\//;
        this.IMAGE_TYPE_REGREX_SUFFIX = /png|jpg|jpeg|gif|bmp/;
        this.IMAGE_TYPE_REGREX_SPLIT = /\s/;
    }
    // 生成当前编辑页面的可预览代码片段
    // @Override
    createContentSnippet() {
        return __awaiter(this, void 0, void 0, function* () {
            let editor = vscode_1.window.activeTextEditor;
            if (!editor) {
                return htmlUtil_1.HtmlUtil.errorSnippet(this.getWindowErrorMessage());
            }
            let previewSnippet = yield this.generatePreviewSnippet(editor);
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
        return `Active editor doesn't show any  ${this.IMAGE_TYPE_REGREX_SUFFIX} - no properties to preview.`;
    }
    getWindowErrorMessage() {
        return `No Active editor - no properties to preview.`;
    }
    imageSrcSnippet(imageUri) {
        return htmlUtil_1.HtmlUtil.createRemoteSource(htmlUtil_1.SourceType.IMAGE, imageUri);
    }
    // 获取指定位置开始后的第一个分隔符的位置
    indexOfSplit(editor, startPos) {
        return textUtil_1.TextUtil.regexIndexOf(editor, startPos, this.IMAGE_TYPE_REGREX_SPLIT);
    }
    // 获取指定位置开始后的第一个后缀的位置
    indexOfSuffix(editor, startPos) {
        return textUtil_1.TextUtil.regexIndexOf(editor, startPos, this.IMAGE_TYPE_REGREX_SUFFIX);
    }
    // 获取指定位置开始前的第一个资源前缀的位置
    lastIndexOfPrefix(editor, startPos) {
        return textUtil_1.TextUtil.regexLastIndexOf(editor, startPos, this.IMAGE_TYPE_REGREX_PREFFIX);
    }
    // 获取指定位置开始前的第一个资源前缀的位置
    lastIndexOfSuffix(editor, startPos) {
        return textUtil_1.TextUtil.regexLastIndexOf(editor, startPos, this.IMAGE_TYPE_REGREX_SUFFIX);
    }
    // 获取指定位置开始后的第一个分隔符前的最后一个后缀的位置
    getEndOfImageUrl(editor, startPosOfImageUrl, startPosOfSplit) {
        if (!editor) {
            return -1;
        }
        let startIndexOfSuffix = this.lastIndexOfSuffix(editor, startPosOfSplit);
        let startPosOfSuffix = startIndexOfSuffix.pos;
        let selectedSuffix = startIndexOfSuffix.mark;
        if (startPosOfSuffix < 0) {
            return startPosOfSplit;
        }
        else {
            if (startPosOfSuffix < startPosOfImageUrl) {
                return -1;
            }
            return startPosOfSuffix + selectedSuffix.length;
        }
    }
    getSplitOfImageUrl(editor, startIndexOfImageUrl) {
        if (!editor) {
            return -1;
        }
        let startPosOfSplit = this.indexOfSplit(editor, startIndexOfImageUrl.pos + startIndexOfImageUrl.mark.length).pos;
        if (startPosOfSplit < 0) {
            startPosOfSplit = editor.document.getText().length;
        }
        return startPosOfSplit;
    }
    getFirstSelectedImageUri(editor) {
        if (!editor) {
            return undefined;
        }
        // 获取当前鼠标选中段落的起始位置        
        let startPosOfSelectionText = editor.document.offsetAt(editor.selection.anchor);
        let startIndexOfImageUrl = this.lastIndexOfPrefix(editor, startPosOfSelectionText);
        let startPosOfImageUrl = startIndexOfImageUrl.pos;
        let selectPrefix = startIndexOfImageUrl.mark;
        if (startPosOfImageUrl < 0) {
            return undefined;
        }
        let startPosOfSplit = this.getSplitOfImageUrl(editor, startIndexOfImageUrl);
        let endNextPosOfImageUrl = this.getEndOfImageUrl(editor, startPosOfImageUrl, startPosOfSplit);
        if (endNextPosOfImageUrl < 0) {
            return undefined;
        }
        let imgSrcUri = editor.document.getText().slice(startPosOfImageUrl, endNextPosOfImageUrl);
        return imgSrcUri;
    }
    // 生成预览编辑页面
    generatePreviewSnippet(editor) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!editor) {
                return htmlUtil_1.HtmlUtil.errorSnippet(this.getWindowErrorMessage());
            }
            let imageUri = this.getFirstSelectedImageUri(editor);
            if (!imageUri || imageUri.length <= 0) {
                return htmlUtil_1.HtmlUtil.errorSnippet(this.getErrorMessage());
            }
            let targetImageUri = yield htmlUtil_1.HtmlUtil.fixImageRedirectUrl(imageUri);
            let head = htmlUtil_1.HtmlUtil.createLocalSource(htmlUtil_1.SourceType.LINK, "header_fix.css");
            let body = htmlUtil_1.HtmlUtil.createRemoteSource(htmlUtil_1.SourceType.DIVISION, targetImageUri) +
                htmlUtil_1.HtmlUtil.createRemoteSourceAtNewline(htmlUtil_1.SourceType.HR) +
                htmlUtil_1.HtmlUtil.createRemoteSource(htmlUtil_1.SourceType.CUSTOM_NEWLINE) +
                htmlUtil_1.HtmlUtil.fixImageSrcLinks(this.imageSrcSnippet(targetImageUri));
            return htmlUtil_1.HtmlUtil.createFullHtmlSnippetFrom(head, body);
        });
    }
}
//# sourceMappingURL=imageDocumentContentManager.js.map