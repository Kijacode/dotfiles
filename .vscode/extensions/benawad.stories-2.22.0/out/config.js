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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const vscode = __importStar(require("vscode"));
const home = process.env.HOME || process.env.USERPROFILE;
// https://github.com/arciisine/vscode-chronicler/blob/master/src/config.ts
class Config {
    static get _config() {
        return vscode.workspace.getConfiguration();
    }
    static hasConfig(key) {
        const conf = this.getConfig(key);
        return conf !== null && conf !== undefined && conf !== "";
    }
    static getConfig(key) {
        return this._config.has(`stories.${key}`)
            ? this._config.get(`stories.${key}`)
            : null;
    }
    static setConfig(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._config.update(`stories.${key}`, value, vscode.ConfigurationTarget.Global);
        });
    }
}
exports.Config = Config;
//# sourceMappingURL=config.js.map