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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlairProvider = void 0;
const fs = __importStar(require("fs"));
const vscode = __importStar(require("vscode"));
const btoa_1 = __importDefault(require("btoa"));
class FlairProvider {
    static init() {
        const flairPath = vscode.Uri.joinPath(this.extensionUri, "media", "flairs");
        const files = fs.readdirSync(flairPath.fsPath);
        files.forEach((f) => {
            const uri = vscode.Uri.joinPath(this.extensionUri, "media", "flairs", f);
            const content = fs.readFileSync(uri.fsPath, { encoding: "utf-8" });
            const flairName = f.split(".")[0];
            this.flairMap[flairName] = "data:image/svg+xml;base64," + btoa_1.default(content);
            this.flairUriMap[flairName] = uri;
        });
    }
    static getJavascriptMapString() {
        if (!this.javascriptMapString) {
            return `
      const flairMap = {
        ${Object.entries(this.flairMap).map(([k, v]) => `"${k}": "${v}"`)}
      }
      `;
        }
        return this.javascriptMapString;
    }
}
exports.FlairProvider = FlairProvider;
FlairProvider.flairMap = {};
FlairProvider.flairUriMap = {};
FlairProvider.javascriptMapString = "";
//# sourceMappingURL=FlairProvider.js.map