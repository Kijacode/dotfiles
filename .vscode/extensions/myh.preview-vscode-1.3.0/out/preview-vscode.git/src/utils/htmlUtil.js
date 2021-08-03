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
let fileUrl = require("file-url");
var SourceType;
(function (SourceType) {
    SourceType[SourceType["BODY"] = 0] = "BODY";
    SourceType[SourceType["BR"] = 1] = "BR";
    SourceType[SourceType["COMMENT"] = 2] = "COMMENT";
    SourceType[SourceType["DIVISION"] = 3] = "DIVISION";
    SourceType[SourceType["DOCTYPE"] = 4] = "DOCTYPE";
    SourceType[SourceType["HEAD"] = 5] = "HEAD";
    SourceType[SourceType["HR"] = 6] = "HR";
    SourceType[SourceType["HTML"] = 7] = "HTML";
    SourceType[SourceType["IMAGE"] = 8] = "IMAGE";
    SourceType[SourceType["LINK"] = 9] = "LINK";
    SourceType[SourceType["SCRIPT"] = 10] = "SCRIPT";
    SourceType[SourceType["STYLE"] = 11] = "STYLE";
    SourceType[SourceType["CUSTOM_MERMAID_SAMPLE"] = 12] = "CUSTOM_MERMAID_SAMPLE";
    SourceType[SourceType["CUSTOM_STYLE_SAMPLE"] = 13] = "CUSTOM_STYLE_SAMPLE";
    SourceType[SourceType["CUSTOM_NEWLINE"] = 14] = "CUSTOM_NEWLINE"; // 返回\n
})(SourceType = exports.SourceType || (exports.SourceType = {}));
class HtmlUtil {
    // @Override
    static sendPreviewCommand(previewUri, displayColumn) {
        return vscode_1.commands.executeCommand(this.COMMAND, previewUri, displayColumn).then((success) => {
        }, (reason) => {
            console.warn(reason);
            vscode_1.window.showErrorMessage(reason);
        });
    }
    static createFullHtmlSnippetFrom(headPayLoad, bodyPayLoad) {
        return this.createRemoteSource(SourceType.DOCTYPE, this.createRemoteSource(SourceType.HTML, this.createRemoteSource(SourceType.HEAD, headPayLoad)
            + this.createRemoteSource(SourceType.CUSTOM_NEWLINE, undefined)
            + this.createRemoteSource(SourceType.BODY, bodyPayLoad)));
    }
    static errorSnippet(error) {
        return this.createFullHtmlSnippetFrom(undefined, this.createRemoteSource(SourceType.DIVISION, error));
    }
    static isWithPayLoad(payLoad) {
        if (!!payLoad && payLoad.length > 0) {
            return true;
        }
        return false;
    }
    // 生成本地文件对应URI的html标签代码片段
    static createRemoteSourceAtNewline(type, payLoad) {
        return HtmlUtil.createRemoteSource(SourceType.CUSTOM_NEWLINE, HtmlUtil.createRemoteSource(type, payLoad));
    }
    // 生成本地文件对应URI的html标签代码片段
    static createRemoteSource(type, payLoad) {
        switch (type) {
            case SourceType.BODY:
                return this.createRemoteSourceOfBODY(payLoad);
            case SourceType.BR:
                return this.createRemoteSourceOfBR(payLoad);
            case SourceType.COMMENT:
                return this.createRemoteSourceOfCOMMENT(payLoad);
            case SourceType.DIVISION:
                return this.createRemoteSourceOfDIVISION(payLoad);
            case SourceType.DOCTYPE:
                return this.createRemoteSourceOfDOCTYPE(payLoad);
            case SourceType.HEAD:
                return this.createRemoteSourceOfHEAD(payLoad);
            case SourceType.HR:
                return this.createRemoteSourceOfHR(payLoad);
            case SourceType.HTML:
                return this.createRemoteSourceOfHTML(payLoad);
            case SourceType.IMAGE:
                return this.createRemoteSourceOfIMAGE(payLoad);
            case SourceType.LINK:
                return this.createRemoteSourceOfLINK(payLoad);
            case SourceType.SCRIPT:
                return this.createRemoteSourceOfSCRIPT(payLoad);
            case SourceType.STYLE:
                return this.createRemoteSourceOfSTYLE(payLoad);
            case SourceType.CUSTOM_NEWLINE:
                return this.createRemoteSourceOfCUSTOM_NEWLINE(payLoad);
            case SourceType.CUSTOM_MERMAID_SAMPLE:
                return this.createRemoteSourceOfCUSTOM_MERMAID_SAMPLE(payLoad);
            case SourceType.CUSTOM_STYLE_SAMPLE:
                return this.createRemoteSourceOfCUSTOM_STYLE_SAMPLE(payLoad);
        }
    }
    // 生成本地文件对应URI的html标签代码片段
    static createLocalSource(type, fileName) {
        // __dirname 是package.json中"main"字段对应的绝对目录
        // 生成本地文件绝对路径URI
        let source_path = fileUrl(path.join(__dirname, "..", "..", "..", "static", fileName));
        return this.createRemoteSource(type, source_path);
    }
    // 将html中将非http或\/开头的URI增加本地待预览html所在目录的前缀
    static fixNoneNetLinks(document, documentPath) {
        return document.replace(
        // 子表达式的序号问题
        // 简单地说：从左向右，以分组的左括号为标志，
        // 过程是要从左向右扫描两遍的：
        // 第一遍只给未命名组分配，
        // 第二遍只给命名组分配－－因此所有命名组的组号都大于未命名的组号。
        // 可以使用(?:exp)这样的语法来剥夺一个分组对组号分配的参与权．
        // http://www.cnblogs.com/dwlsxj/p/3532458.html
        new RegExp("((?:src|href)=[\'\"])((?!http|\\/).*?)([\'\"])", "gmi"), (subString, p1, p2, p3) => {
            return [
                p1.trim(),
                fileUrl(path.join(path.dirname(documentPath), p2)).trim(),
                p3.trim()
            ].join("");
        });
    }
    // 将html中将file://去掉,且恢复默认绝对路径
    static fixImageSrcLinks(imageSnippet) {
        if (!imageSnippet) {
            return imageSnippet;
        }
        return imageSnippet.replace(
        // 子表达式的序号问题
        // 简单地说：从左向右，以分组的左括号为标志，
        // 过程是要从左向右扫描两遍的：
        // 第一遍只给未命名组分配，
        // 第二遍只给命名组分配－－因此所有命名组的组号都大于未命名的组号。
        // 可以使用(?:exp)这样的语法来剥夺一个分组对组号分配的参与权．
        new RegExp("((?:src|href)=[\'\"])(?:file://)(.*?)([\'\"])", "gmi"), (subString, p1, p2, p3) => {
            return [
                p1.trim(),
                path.resolve("/" + p2).trim(),
                p3.trim()
            ].join("");
        });
    }
    static fixImageRedirectUrl(srcUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!srcUrl) {
                return srcUrl;
            }
            let result = null;
            if ((result = HtmlUtil.HTTP_S_REGREX_PREFFIX.exec(srcUrl)) == null) {
                return srcUrl;
            }
            try {
                return yield HtmlUtil.getRedirectUrl(srcUrl);
            }
            catch (error) {
                return srcUrl;
            }
        });
    }
    static getRedirectUrl(firstUrl) {
        return new Promise(function (resolve, reject) {
            var request = require("request");
            var options = {
                method: 'GET',
                url: firstUrl,
                // followAllRedirects: false,
                // maxRedirects: 1,
                headers: {
                    'cache-control': 'no-cache'
                }
            };
            var r = request(options, function (error, response, body) {
                if (error)
                    return reject(error);
                resolve(this.uri.href);
            });
        });
    }
    static createRemoteSourceOfBODY(payLoad) {
        if (!this.isWithPayLoad(payLoad)) {
            return ``;
        }
        return `<body>
                    ${payLoad}
                </body>`;
    }
    static createRemoteSourceOfBR(payLoad) {
        if (!this.isWithPayLoad(payLoad)) {
            return `<br>`;
        }
        return `<br>
                ${payLoad}`;
    }
    static createRemoteSourceOfCOMMENT(payLoad) {
        if (!this.isWithPayLoad(payLoad)) {
            return ``;
        }
        return `<!-- ${payLoad} -->`;
    }
    static createRemoteSourceOfDIVISION(payLoad) {
        if (!this.isWithPayLoad(payLoad)) {
            return ``;
        }
        return `<div>${payLoad}</div>`;
    }
    static createRemoteSourceOfDOCTYPE(payLoad) {
        if (!this.isWithPayLoad(payLoad)) {
            return `<!DOCTYPE html>`;
        }
        return `<!DOCTYPE html>
                ${payLoad}`;
    }
    static createRemoteSourceOfHEAD(payLoad) {
        if (!this.isWithPayLoad(payLoad)) {
            return ``;
        }
        return `<head>
                    ${payLoad}
                </head>`;
    }
    static createRemoteSourceOfHR(payLoad) {
        if (!this.isWithPayLoad(payLoad)) {
            return `<hr>`;
        }
        return `<hr>
                ${payLoad}`;
    }
    static createRemoteSourceOfHTML(payLoad) {
        if (!this.isWithPayLoad(payLoad)) {
            return ``;
        }
        return `<html>
                    ${payLoad}
                </html>`;
    }
    static createRemoteSourceOfIMAGE(payLoad) {
        if (!this.isWithPayLoad(payLoad)) {
            return ``;
        }
        return `<img src="${payLoad}"/>`;
    }
    static createRemoteSourceOfLINK(payLoad) {
        if (!this.isWithPayLoad(payLoad)) {
            return ``;
        }
        return `<link href="${payLoad}" rel="stylesheet" />`;
    }
    static createRemoteSourceOfSCRIPT(payLoad) {
        if (!this.isWithPayLoad(payLoad)) {
            return ``;
        }
        return `<script src="${payLoad}"></script>`;
    }
    static createRemoteSourceOfSTYLE(payLoad) {
        if (!this.isWithPayLoad(payLoad)) {
            return ``;
        }
        return `<style type=\"text/css\">
                    ${payLoad}
                </style>`;
    }
    static createRemoteSourceOfCUSTOM_NEWLINE(payLoad) {
        if (!this.isWithPayLoad(payLoad)) {
            return `\n`;
        }
        return `\n${payLoad}`;
    }
    static createRemoteSourceOfCUSTOM_MERMAID_SAMPLE(payLoad) {
        if (!this.isWithPayLoad(payLoad)) {
            return ``;
        }
        var head = `<link href="${this.getExtensionPath()}/node_modules/mermaid/dist/mermaid.forest.css" rel="stylesheet">
                    <script src="${this.getExtensionPath()}/node_modules/mermaid/dist/mermaid.min.js">
                    <script type="text/javascript">
                        mermaid.initialize({startOnLoad:true});
                    </script>`;
        var body = `
                    <hr>
                    <div class="mermaid">
                        ${payLoad}
                    </div>`;
        return HtmlUtil.createFullHtmlSnippetFrom(head, body);
    }
    static getExtensionPath() {
        return path.join(__dirname, "..", "..", "..");
    }
    static createRemoteSourceOfCUSTOM_STYLE_SAMPLE(payLoad) {
        if (!this.isWithPayLoad(payLoad)) {
            return ``;
        }
        var head = HtmlUtil.createRemoteSource(SourceType.STYLE, `#css_property {
                ${payLoad}
            }`);
        var body = `<div>Preview of the CSS properties
                        {
                            ${payLoad}
                        }
                    </div>
                    <hr>
                    <div id=\"css_property\">Hello World</div>`;
        return HtmlUtil.createFullHtmlSnippetFrom(head, body);
    }
}
HtmlUtil.COMMAND = "vscode.previewHtml";
HtmlUtil.HTTP_S_REGREX_PREFFIX = /http[s]{0,1}:\/\//;
exports.HtmlUtil = HtmlUtil;
//# sourceMappingURL=htmlUtil.js.map