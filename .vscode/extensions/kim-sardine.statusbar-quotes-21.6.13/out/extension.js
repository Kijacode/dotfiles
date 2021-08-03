"use strict";
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
const vscode = require("vscode");
const constants = require("./constants");
const quoter_1 = require("./models/quoter");
const supportedCategory = [constants.CATEGORY_ALL, constants.CATEGORY_WISE_SAYING, constants.CATEGORY_PROGRAMMING, constants.CATEGORY_STARTUP];
const supportedLanguage = [constants.LANG_ENGLISH, constants.LANG_KOREAN];
const defaultCategory = constants.CATEGORY_ALL;
const defaultLanguage = constants.LANG_ENGLISH;
const defaultDisplaySeconds = constants.DEFAULT_DISPLAY_SECONDS;
const defaultDisplayShuffleButton = true;
function activate(context) {
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
    statusBarItem.show();
    statusBarItem.command = constants.CMD_SHOW_QUOTE_ON_MODAL;
    context.subscriptions.push(statusBarItem);
    const statusBarItemforShuffle = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 2);
    statusBarItemforShuffle.show();
    statusBarItemforShuffle.text = '$(search-refresh)';
    statusBarItemforShuffle.tooltip = 'Click to get new quotes';
    statusBarItemforShuffle.command = constants.CMD_SHUFFLE_QUOTES;
    context.subscriptions.push(statusBarItemforShuffle);
    let initialCategory = vscode.workspace.getConfiguration(constants.EXTENSION_ID).get("category", defaultCategory);
    let initialLanguage = vscode.workspace.getConfiguration(constants.EXTENSION_ID).get("language", defaultLanguage);
    let initialDisplaySeconds = vscode.workspace.getConfiguration(constants.EXTENSION_ID).get("display-seconds", defaultDisplaySeconds);
    let initialDisplayShuffleButton = vscode.workspace.getConfiguration(constants.EXTENSION_ID).get("display-shuffle-button", defaultDisplayShuffleButton);
    const quoter = new quoter_1.default(initialCategory, initialLanguage, initialDisplaySeconds);
    if (initialDisplayShuffleButton) {
        statusBarItemforShuffle.show();
    }
    quoter.start();
    quoter.onTimeChanged(_ => {
        statusBarItem.text = quoter.quoteText;
        statusBarItem.tooltip = quoter.quoteTooltip;
    });
    context.subscriptions.push(vscode.commands.registerCommand(constants.CMD_SHOW_QUOTE_ON_MODAL, () => {
        vscode.window.showInformationMessage(quoter.quoteModal);
    }));
    // Settings
    const cmdChangeCatrgory = vscode.commands.registerCommand(constants.CMD_CHANGE_CATEGORY, () => __awaiter(this, void 0, void 0, function* () {
        let category = yield vscode.window.showQuickPick(supportedCategory, { placeHolder: `Select category` });
        if (!category) {
            return;
        }
        yield vscode.workspace.getConfiguration(constants.EXTENSION_ID).update("category", category, true);
        quoter.setCategory(category);
    }));
    context.subscriptions.push(cmdChangeCatrgory);
    const cmdChangeLanguage = vscode.commands.registerCommand(constants.CMD_CHANGE_LANGUAGE, () => __awaiter(this, void 0, void 0, function* () {
        let language = yield vscode.window.showQuickPick(supportedLanguage, { placeHolder: `Select Language` });
        if (!language) {
            return;
        }
        yield vscode.workspace.getConfiguration(constants.EXTENSION_ID).update("language", language, true);
        quoter.setLanguage(language);
    }));
    context.subscriptions.push(cmdChangeLanguage);
    const cmdChangeDisplaySeconds = vscode.commands.registerCommand(constants.CMD_CHANGE_DISPLAY_SECONDS, () => __awaiter(this, void 0, void 0, function* () {
        let display_seconds = yield vscode.window.showInputBox({
            prompt: 'Quote change time interval (seconds)',
            placeHolder: `Range : 0 (do not change quote) ~ ${constants.MAXIMUM_DISPLAY_SECONDS} (${constants.MAXIMUM_DISPLAY_SECONDS_HUMANIZE})`
        });
        if (!display_seconds || isNaN(parseInt(display_seconds))) {
            vscode.window.showWarningMessage(`You can only enter number between 0 and ${constants.MAXIMUM_DISPLAY_SECONDS}`);
            return;
        }
        let _display_seconds = parseInt(display_seconds);
        if (_display_seconds > constants.MAXIMUM_DISPLAY_SECONDS) {
            _display_seconds = constants.MAXIMUM_DISPLAY_SECONDS;
        }
        yield vscode.workspace.getConfiguration(constants.EXTENSION_ID).update("display-seconds", _display_seconds, true);
    }));
    context.subscriptions.push(cmdChangeDisplaySeconds);
    const cmdShuffleQuotes = vscode.commands.registerCommand(constants.CMD_SHUFFLE_QUOTES, () => __awaiter(this, void 0, void 0, function* () {
        quoter.initElapsedSeconds();
        quoter.displayRandomQuote();
    }));
    context.subscriptions.push(cmdShuffleQuotes);
    const onConfigurationChanged = vscode.workspace.onDidChangeConfiguration((event) => {
        if (event.affectsConfiguration(constants.SETTING_CATEGORY)) {
            let newCategory = vscode.workspace.getConfiguration(constants.EXTENSION_ID).get("category", defaultCategory);
            quoter.setCategory(newCategory);
        }
        else if (event.affectsConfiguration(constants.SETTING_LANGUAGE)) {
            let newLanguage = vscode.workspace.getConfiguration(constants.EXTENSION_ID).get("language", defaultLanguage);
            quoter.setLanguage(newLanguage);
        }
        else if (event.affectsConfiguration(constants.SETTING_DISPLAY_SECONDS)) {
            // TODO: Validation
            let newDisplaySeconds = vscode.workspace.getConfiguration(constants.EXTENSION_ID).get("display-seconds", defaultDisplaySeconds);
            quoter.setDisplaySeconds(newDisplaySeconds);
        }
        else if (event.affectsConfiguration(constants.SETTING_DISPLAY_SHUFFLE_BUTTON)) {
            let newDisplayShuffleButton = vscode.workspace.getConfiguration(constants.EXTENSION_ID).get("display-shuffle-button", defaultDisplayShuffleButton);
            if (newDisplayShuffleButton) {
                statusBarItemforShuffle.show();
            }
            else {
                statusBarItemforShuffle.hide();
            }
        }
    });
    context.subscriptions.push(onConfigurationChanged);
}
exports.activate = activate;
// TODO: Dispose on deactivation
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map