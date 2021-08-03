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
exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const authenticate_1 = require("./authenticate");
const mutation_1 = require("./mutation");
const status_1 = require("./status");
const StorySidebarProvider_1 = require("./StorySidebarProvider");
const util_1 = require("./util");
const FlairProvider_1 = require("./FlairProvider");
const constants_1 = require("./constants");
const PreviewStoryPanel_1 = require("./PreviewStoryPanel");
function activate(context) {
    util_1.Util.context = context;
    FlairProvider_1.FlairProvider.extensionUri = context.extensionUri;
    FlairProvider_1.FlairProvider.init();
    function showSoldMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            const choice = yield vscode.window.showInformationMessage(`I sold VSCode Stories and now it's being maintained as a new extension, would you like to download it?`, "Yes", "View Kickstarter", "Dismiss");
            if (choice === "Yes") {
                vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(constants_1.newExtensionUrl));
            }
            else if (choice === "View on Kickstarter") {
                vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(constants_1.kickstarterUrl));
            }
        });
    }
    if (!context.globalState.get("sold-message")) {
        context.globalState.update("sold-message", "true");
        showSoldMessage();
    }
    vscode.commands.registerCommand("stories.setFlair", () => {
        showSoldMessage();
        return;
        vscode.window
            .showQuickPick(["vanilla js", ...Object.keys(FlairProvider_1.FlairProvider.flairMap)])
            .then((flair) => {
            if (flair) {
                mutation_1.mutationNoErr("/update-flair", {
                    flair,
                }).then(() => {
                    vscode.window.showInformationMessage("Flair successfully set, it'll show up next time stories are loaded.");
                });
            }
        });
    });
    vscode.commands.registerCommand("stories.authenticate", () => {
        showSoldMessage();
        return;
        authenticate_1.authenticate();
    });
    const provider = new StorySidebarProvider_1.StorySidebarProvider(context.extensionUri);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider("storiesPanel", provider));
    const provider2 = new StorySidebarProvider_1.StorySidebarProvider(context.extensionUri);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider("stories-full", provider2));
    vscode.commands.registerCommand("stories.refresh", () => {
        var _a, _b;
        showSoldMessage();
        return;
        (_a = provider._view) === null || _a === void 0 ? void 0 : _a.webview.postMessage({
            command: "refresh",
        });
        (_b = provider2._view) === null || _b === void 0 ? void 0 : _b.webview.postMessage({
            command: "refresh",
        });
    });
    let isRecording = false;
    let filename = "untitled";
    let data = [];
    let startingText = "";
    let language = "";
    let startDate = new Date().getTime();
    let lastDelete = false;
    let lastMs = 0;
    const status = new status_1.RecordingStatus();
    const stop = () => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        status.stop();
        isRecording = false;
        PreviewStoryPanel_1.PreviewStoryPanel.createOrShow(context.extensionUri, {
            initRecordingSteps: data,
            intialText: startingText,
        });
        const choice = yield vscode.window.showInformationMessage(`Your story is ready to go!`, "Publish", "Discard");
        if (choice !== "Publish") {
            vscode.commands.executeCommand("workbench.action.closeActiveEditor");
            return;
        }
        const story = yield vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Uploading...",
            cancellable: false,
        }, () => {
            return mutation_1.mutationNoErr("/new-text-story", {
                filename,
                text: startingText,
                recordingSteps: data,
                programmingLanguageId: language,
            });
        });
        if (story) {
            setTimeout(() => {
                vscode.window.showInformationMessage("Story successfully created");
            }, 800);
            (_a = provider._view) === null || _a === void 0 ? void 0 : _a.webview.postMessage({
                command: "new-story",
                story,
            });
            (_b = provider2._view) === null || _b === void 0 ? void 0 : _b.webview.postMessage({
                command: "new-story",
                story,
            });
        }
    });
    vscode.commands.registerCommand("stories.startTextRecording", () => __awaiter(this, void 0, void 0, function* () {
        showSoldMessage();
        return;
        // if (!Util.isLoggedIn()) {
        //   const choice = await vscode.window.showInformationMessage(
        //     `You need to login to GitHub to record a story, would you like to continue?`,
        //     "Yes",
        //     "Cancel"
        //   );
        //   if (choice === "Yes") {
        //     authenticate();
        //   }
        //   return;
        // }
        // if (!vscode.window.activeTextEditor) {
        //   vscode.window.showInformationMessage(
        //     "Open a file to start recording a story"
        //   );
        //   return;
        // }
        // try {
        //   await status.countDown();
        // } catch (err) {
        //   vscode.window.showWarningMessage("Recording cancelled");
        //   return;
        // }
        // status.start();
        // filename = vscode.window.activeTextEditor.document.fileName;
        // startingText = vscode.window.activeTextEditor.document.getText();
        // language = vscode.window.activeTextEditor.document.languageId;
        // lastDelete = false;
        // lastMs = 0;
        // data = [[0, []]];
        // isRecording = true;
        // startDate = new Date().getTime();
    }));
    vscode.commands.registerCommand("stories.stopTextRecording", () => {
        showSoldMessage();
        return;
        stop();
    });
    // context.subscriptions.push(
    //   vscode.workspace.onDidChangeTextDocument(
    //     (event) => {
    //       if (isRecording) {
    //         if (data.length > 100000) {
    //           isRecording = false;
    //           vscode.window.showWarningMessage(
    //             "Recording automatically stopped, the recording data is getting really big."
    //           );
    //           stop();
    //           return;
    //         }
    //         const ms = new Date().getTime() - startDate;
    //         if (ms - 10 > lastMs) {
    //           data.push([ms, []]);
    //         }
    //         for (const change of event.contentChanges) {
    //           if (change.text === "") {
    //             if (lastDelete) {
    //               data[data.length - 1][1].push(change);
    //               continue;
    //             }
    //             data.push([ms, [change]]);
    //             lastDelete = true;
    //           } else {
    //             data[data.length - 1][1].push(change);
    //           }
    //         }
    //         lastMs = ms;
    //       }
    //     },
    //     null,
    //     context.subscriptions
    //   )
    // );
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map