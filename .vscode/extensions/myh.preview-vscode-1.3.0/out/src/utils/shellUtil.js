"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
let fileUrl = require("file-url");
class ShellUtil {
    static execPromisLike(cmd) {
        return new Promise((resolve, reject) => {
            child_process_1.exec(cmd, (error, stdout, stderr) => {
                if (error) {
                    let errorMessage = [
                        error.name,
                        error.message,
                        error.stack,
                        "",
                        stderr.toString()
                    ].join("\n");
                    reject(errorMessage);
                }
                resolve(stdout.toString());
            });
        });
    }
}
exports.ShellUtil = ShellUtil;
//# sourceMappingURL=shellUtil.js.map