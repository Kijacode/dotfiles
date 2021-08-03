"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Util = void 0;
const path = __importStar(require("path"));
const vscode = __importStar(require("vscode"));
const constants_1 = require("./constants");
// https://github.com/arciisine/vscode-chronicler/blob/master/src/util.ts
class Util {
    static getRefreshToken() {
        return this.context.globalState.get(constants_1.refreshTokenKey) || "";
    }
    static getAccessToken() {
        return this.context.globalState.get(constants_1.accessTokenKey) || "";
    }
    static isLoggedIn() {
        return (!!this.context.globalState.get(constants_1.accessTokenKey) &&
            !!this.context.globalState.get(constants_1.refreshTokenKey));
    }
    static getWorkspacePath() {
        const folders = vscode.workspace.workspaceFolders;
        return folders ? folders[0].uri.fsPath : undefined;
    }
    static getResource(rel) {
        return path
            .resolve(this.context.extensionPath, rel.replace(/\//g, path.sep))
            .replace(/\\/g, "/");
    }
}
exports.Util = Util;
//# sourceMappingURL=util.js.map