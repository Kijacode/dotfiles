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
exports.authenticate = void 0;
const polka_1 = __importDefault(require("polka"));
const vscode = __importStar(require("vscode"));
const constants_1 = require("./constants");
const util_1 = require("./util");
// https://github.com/shanalikhan/code-settings-sync/blob/master/src/service/github.oauth.service.ts
exports.authenticate = () => {
    const app = polka_1.default();
    const server = app.listen(54321);
    vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(`${constants_1.apiBaseUrl}/auth/github`));
    app.get("/callback/:token/:refreshToken", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { token, refreshToken } = req.params;
        if (!token || !refreshToken) {
            res.end(`ext: something went wrong`);
            app.server.close();
            return;
        }
        yield util_1.Util.context.globalState.update(constants_1.accessTokenKey, token);
        yield util_1.Util.context.globalState.update(constants_1.refreshTokenKey, refreshToken);
        res.end(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta
          http-equiv="Content-Security-Policy"
          content="default-src vscode-resource:; form-action vscode-resource:; frame-ancestors vscode-resource:; img-src vscode-resource: https:; script-src 'self' 'unsafe-inline' vscode-resource:; style-src 'self' 'unsafe-inline' vscode-resource:;"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      </head>
      <body>
          <h1>Success! You may now close this tab.</h1>
          <style>
            html, body {
              background-color: #1a1a1a;
              color: #c3c3c3;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100%;
              width: 100%;
              margin: 0;
            }
          </style>
      </body>
    </html>
    `);
        app.server.close();
    }));
};
//# sourceMappingURL=authenticate.js.map