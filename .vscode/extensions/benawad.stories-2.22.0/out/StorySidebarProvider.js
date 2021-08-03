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
exports.StorySidebarProvider = void 0;
const vscode = __importStar(require("vscode"));
const constants_1 = require("./constants");
const FlairProvider_1 = require("./FlairProvider");
const getNonce_1 = require("./getNonce");
const ViewStoryPanel_1 = require("./ViewStoryPanel");
class StorySidebarProvider {
    constructor(_extensionUri) {
        this._extensionUri = _extensionUri;
    }
    resolveWebviewView(webviewView, context, _token) {
        this._view = webviewView;
        webviewView.webview.options = {
            // Allow scripts in the webview
            enableScripts: true,
            localResourceRoots: [this._extensionUri],
        };
        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
        webviewView.webview.onDidReceiveMessage((data) => __awaiter(this, void 0, void 0, function* () {
            switch (data.type) {
                case "onStoryPress": {
                    if (!data.value) {
                        return;
                    }
                    ViewStoryPanel_1.ViewStoryPanel.createOrShow(this._extensionUri, data.value);
                    break;
                }
                case "onError": {
                    if (!data.value) {
                        return;
                    }
                    vscode.window.showErrorMessage(data.value);
                    break;
                }
            }
        }));
    }
    _getHtmlForWebview(webview) {
        const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "media", "reset.css"));
        // const scriptUri = webview.asWebviewUri(
        //   vscode.Uri.joinPath(this._extensionUri, "out", "compiled/sidebar.js")
        // );
        // const styleMainUri = webview.asWebviewUri(
        //   vscode.Uri.joinPath(this._extensionUri, "out", "compiled/sidebar.css")
        // );
        const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css"));
        // Use a nonce to only allow a specific script to be run.
        const nonce = getNonce_1.getNonce();
        return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
        -->
        <meta http-equiv="Content-Security-Policy" content="default-src ${constants_1.apiBaseUrl}; img-src https: data:; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">
        <script nonce="${nonce}">
            const apiBaseUrl = "${constants_1.apiBaseUrl}";
            const tsvscode = acquireVsCodeApi();
            ${FlairProvider_1.FlairProvider.getJavascriptMapString()}
        </script>
			</head>
      <body>
      <div>I sold VSCode Stories and now it's being maintained as a new extension:</div>
      <a href="${constants_1.newExtensionUrl}">click to download</a>
      <br />
      <br />
      <div>The new owner is also doing a Kickstarter:</div>
      <a href="${constants_1.kickstarterUrl}">support it and receive a PRO badge!</a>
      <br />
      <br />
      <a href="https://youtu.be/CHO316LKnZw">More info and why I sold it</a>
			</body>
			</html>`;
    }
}
exports.StorySidebarProvider = StorySidebarProvider;
//# sourceMappingURL=StorySidebarProvider.js.map