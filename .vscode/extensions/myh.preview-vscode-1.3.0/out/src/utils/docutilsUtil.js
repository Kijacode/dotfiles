"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
let fileUrl = require("file-url");
const shellUtil_1 = require("./shellUtil");
class DocutilsUtil {
    static docutils(command, fileName) {
        return shellUtil_1.ShellUtil.execPromisLike([
            command,
            fileName
        ].join(" "));
    }
    static docutilsFromSouceCode(command, fileName) {
        // __dirname 是package.json中"main"字段对应的绝对目录
        // 生成本地文件绝对路径URI
        let source_path = path.join(__dirname, "..", "..", "..", "libs", "docutils", "tools", command);
        return shellUtil_1.ShellUtil.execPromisLike([
            "python",
            source_path,
            fileName
        ].join(" "));
    }
    static buildhtml(fileName) {
        return this.docutils("buildhtml.py", fileName);
    }
    static rst2html(fileName) {
        return this.docutils("rst2html.py", fileName);
    }
    static rst2html5(fileName) {
        return this.docutils("rst2html5.py", fileName);
    }
    static rst2latex(fileName) {
        return this.docutils("rst2latex.py", fileName);
    }
    static rst2man(fileName) {
        return this.docutils("rst2man.py", fileName);
    }
    static rst2odt(fileName) {
        return this.docutils("rst2odt.py", fileName);
    }
    static rst2odt_prepstyles(fileName) {
        return this.docutils("rst2odt_prepstyles.py", fileName);
    }
    static rst2pseudoxml(fileName) {
        return this.docutils("rst2pseudoxml.py", fileName);
    }
    static rst2s5(fileName) {
        return this.docutils("rst2s5.py", fileName);
    }
    static rst2xetex(fileName) {
        return this.docutils("rst2xetex.py", fileName);
    }
    static rst2xml(fileName) {
        return this.docutils("rst2xml.py", fileName);
    }
    static rstpep2html(fileName) {
        return this.docutils("rstpep2html.py", fileName);
    }
}
exports.DocutilsUtil = DocutilsUtil;
//# sourceMappingURL=docutilsUtil.js.map