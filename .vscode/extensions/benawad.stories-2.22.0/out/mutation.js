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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mutation = exports.mutationNoErr = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const vscode = __importStar(require("vscode"));
const constants_1 = require("./constants");
const util_1 = require("./util");
exports.mutationNoErr = (path, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const d = yield exports.mutation(path, body);
        return d;
    }
    catch (_a) { }
});
exports.mutation = (path, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const r = yield node_fetch_1.default(constants_1.apiBaseUrl + path, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "content-type": "application/json",
                "access-token": util_1.Util.getAccessToken(),
                "refresh-token": util_1.Util.getRefreshToken(),
            },
        });
        if (r.status !== 200) {
            throw new Error(yield r.text());
        }
        const accessToken = r.headers.get("access-token");
        const refreshToken = r.headers.get("refresh-token");
        if (accessToken && refreshToken) {
            yield util_1.Util.context.globalState.update(constants_1.accessTokenKey, accessToken);
            yield util_1.Util.context.globalState.update(constants_1.refreshTokenKey, refreshToken);
        }
        const d = yield r.json();
        return d;
    }
    catch (err) {
        console.log(err);
        vscode.window.showErrorMessage(err.message);
        throw err;
    }
});
//# sourceMappingURL=mutation.js.map