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
exports.ViewStoryPanel = void 0;
const vscode = __importStar(require("vscode"));
const constants_1 = require("./constants");
const FlairProvider_1 = require("./FlairProvider");
const getNonce_1 = require("./getNonce");
const util_1 = require("./util");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class ViewStoryPanel {
    constructor(panel, extensionUri, story) {
        this._disposables = [];
        this._panel = panel;
        this._extensionUri = extensionUri;
        this._story = story;
        // Set the webview's initial html content
        this._update();
        // Listen for when the panel is disposed
        // This happens when the user closes the panel or when the panel is closed programatically
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        // // Handle messages from the webview
        // this._panel.webview.onDidReceiveMessage(
        //   (message) => {
        //     switch (message.command) {
        //       case "alert":
        //         vscode.window.showErrorMessage(message.text);
        //         return;
        //     }
        //   },
        //   null,
        //   this._disposables
        // );
    }
    static createOrShow(extensionUri, story) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;
        // If we already have a panel, show it.
        if (ViewStoryPanel.currentPanel) {
            ViewStoryPanel.currentPanel._panel.reveal(column);
            ViewStoryPanel.currentPanel._story = story;
            ViewStoryPanel.currentPanel._update();
            return;
        }
        // Otherwise, create a new panel.
        const panel = vscode.window.createWebviewPanel(ViewStoryPanel.viewType, "View Story", column || vscode.ViewColumn.One, {
            // Enable javascript in the webview
            enableScripts: true,
            // And restrict the webview to only loading content from our extension's `media` directory.
            localResourceRoots: [
                vscode.Uri.joinPath(extensionUri, "media"),
                vscode.Uri.joinPath(extensionUri, "out/compiled"),
            ],
        });
        ViewStoryPanel.currentPanel = new ViewStoryPanel(panel, extensionUri, story);
    }
    static revive(panel, extensionUri, story) {
        ViewStoryPanel.currentPanel = new ViewStoryPanel(panel, extensionUri, story);
    }
    dispose() {
        ViewStoryPanel.currentPanel = undefined;
        // Clean up our resources
        this._panel.dispose();
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }
    _update() {
        return __awaiter(this, void 0, void 0, function* () {
            const webview = this._panel.webview;
            this._panel.webview.html = this._getHtmlForWebview(webview);
            webview.onDidReceiveMessage((data) => __awaiter(this, void 0, void 0, function* () {
                switch (data.type) {
                    case "close": {
                        vscode.commands.executeCommand("workbench.action.closeActiveEditor");
                        break;
                    }
                    case "onInfo": {
                        if (!data.value) {
                            return;
                        }
                        vscode.window.showInformationMessage(data.value);
                        break;
                    }
                    case "onError": {
                        if (!data.value) {
                            return;
                        }
                        vscode.window.showErrorMessage(data.value);
                        break;
                    }
                    case "tokens": {
                        yield util_1.Util.context.globalState.update(constants_1.accessTokenKey, data.accessToken);
                        yield util_1.Util.context.globalState.update(constants_1.refreshTokenKey, data.refreshToken);
                        break;
                    }
                }
            }));
        });
    }
    _getHtmlForWebview(webview) {
        // // And the uri we use to load this script in the webview
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "out", "compiled/view-story.js"));
        // Local path to css styles
        const styleResetPath = vscode.Uri.joinPath(this._extensionUri, "media", "reset.css");
        const stylesPathMainPath = vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css");
        // Uri to load styles into webview
        const stylesResetUri = webview.asWebviewUri(styleResetPath);
        const stylesMainUri = webview.asWebviewUri(stylesPathMainPath);
        const cssUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "out", "compiled/view-story.css"));
        // Use a nonce to only allow specific scripts to be run
        const nonce = getNonce_1.getNonce();
        const story = this._story;
        this._panel.title = story.creatorUsername;
        if (story.flair in FlairProvider_1.FlairProvider.flairUriMap) {
            const both = FlairProvider_1.FlairProvider.flairUriMap[story.flair];
            this._panel.iconPath = {
                light: both,
                dark: both,
            };
        }
        else {
            this._panel.iconPath = undefined;
        }
        let currentUserId = "";
        try {
            const payload = jsonwebtoken_1.default.decode(util_1.Util.getAccessToken());
            currentUserId = payload.userId;
        }
        catch (_a) { }
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
				<link href="${stylesResetUri}" rel="stylesheet">
				<link href="${stylesMainUri}" rel="stylesheet">
        <link href="${cssUri}" rel="stylesheet">
        <script nonce="${nonce}">
            const currentUserId = "${currentUserId}";
            const story = JSON.parse('${JSON.stringify(this._story)}');
            let accessToken = "${util_1.Util.getAccessToken()}";
            let refreshToken = "${util_1.Util.getRefreshToken()}";
            const apiBaseUrl = "${constants_1.apiBaseUrl}";
            const tsvscode = acquireVsCodeApi();
            ${FlairProvider_1.FlairProvider.getJavascriptMapString()}
        </script>
			</head>
      <body>
			</body>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</html>`;
    }
}
exports.ViewStoryPanel = ViewStoryPanel;
ViewStoryPanel.viewType = "viewStory";
//# sourceMappingURL=ViewStoryPanel.js.map