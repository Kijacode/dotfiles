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
const path = require("path");
const htmlDocumentContentManager = require("./htmlDocumentContentManager");
const markdownDocumentContentManager = require("./markdownDocumentContentManager");
const imageDocumentContentManager = require("./imageDocumentContentManager");
const cssDocumentContentManager = require("./cssDocumentContentManager");
const mermaidDocumentContentManager = require("./mermaidDocumentContentManager");
const reStructuredTextDocumentContentManager = require("./reStructuredTextDocumentContentManager");
const noneDocumentContentManager = require("./noneDocumentContentManager");
const vscodeUtil_1 = require("./utils/vscodeUtil");
var TextDocumentType;
(function (TextDocumentType) {
    TextDocumentType[TextDocumentType["HTML"] = 0] = "HTML";
    TextDocumentType[TextDocumentType["MARKDOWN"] = 1] = "MARKDOWN";
})(TextDocumentType || (TextDocumentType = {}));
class PreviewDocumentContentProvider {
    constructor() {
        // 观察者模式，生成一个事件发生器
        this._onDidChange = new vscode_1.EventEmitter();
        this._documentContentManager = null;
    }
    static get previewScheme() {
        return PreviewDocumentContentProvider.PREVIEW_SCHEME;
    }
    refreshCurrentDocumentContentProvide() {
        return __awaiter(this, void 0, void 0, function* () {
            let editor = vscode_1.window.activeTextEditor;
            let thiz = this;
            //防止在一次预览命令下重复弹出选择预览类型的对话框
            let previewType = yield vscodeUtil_1.VscodeUtil.getPreviewType(editor, !!thiz._documentContentManager);
            switch (previewType) {
                case "html":
                case "jade":
                    thiz._documentContentManager = htmlDocumentContentManager.getInstance();
                    break;
                case "markdown":
                    thiz._documentContentManager = markdownDocumentContentManager.getInstance();
                    break;
                case "css":
                    thiz._documentContentManager = cssDocumentContentManager.getInstance();
                    break;
                case "mermaid":
                    thiz._documentContentManager = mermaidDocumentContentManager.getInstance();
                    break;
                case "rst":
                    thiz._documentContentManager = reStructuredTextDocumentContentManager.getInstance();
                    break;
                case "image":
                    thiz._documentContentManager = imageDocumentContentManager.getInstance();
                    break;
                default:
                    if (!thiz._documentContentManager) {
                        thiz._documentContentManager = noneDocumentContentManager.getInstance();
                    }
                    break;
            }
            return Promise.resolve();
        });
    }
    // @Override 生成当前html规范化的代码文本，编辑器会自动根据该函数的返回值创建一个只读文档
    // uri是scheme
    provideTextDocumentContent(uri) {
        let content = () => __awaiter(this, void 0, void 0, function* () {
            yield this.refreshCurrentDocumentContentProvide();
            return this._documentContentManager.createContentSnippet();
        });
        return content();
    }
    // @Override 获取文档变化这个监听事件，给vscode调用
    // 该事件用来向外公开观察者模式，外部监听者通过该接口注册监听，获知文档的变动情况
    get onDidChange() {
        return this._onDidChange.event;
    }
    // 通知监听者发生待预览HTML文本变化事件
    update() {
        let previewUri = PreviewDocumentContentProvider.getPreviewUri();
        this._onDidChange.fire(previewUri);
    }
    sendPreviewCommand(displayColumn) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.refreshCurrentDocumentContentProvide();
            // 生成预览临时文件的URI
            let previewUri = yield PreviewDocumentContentProvider.getPreviewUri();
            yield this._documentContentManager.sendPreviewCommand(previewUri, displayColumn);
            //主动触发文本更新，因为当预览命令发生变化的时候
            //对于不能判断文本类型的，会弹出文本选择对话框，但是由于文本没有发生变化
            //所以监听者被通知内容更新，还会显示之前缓存下来的内容
            //故而，主动触发通知监听者强制刷新缓存
            return this.update();
        });
    }
    static getPreviewTitle() {
        return `Preview: '${path.basename(vscode_1.window.activeTextEditor.document.fileName)}'`;
    }
    static getPreviewUri() {
        // 预览窗口标题
        let previewTitle = this.getPreviewTitle();
        return vscode_1.Uri.parse(`${PreviewDocumentContentProvider.previewScheme}://preview/${previewTitle}`);
    }
}
PreviewDocumentContentProvider.PREVIEW_SCHEME = "vscode-preview";
exports.PreviewDocumentContentProvider = PreviewDocumentContentProvider;
//# sourceMappingURL=previewDocumentContentProvider.js.map