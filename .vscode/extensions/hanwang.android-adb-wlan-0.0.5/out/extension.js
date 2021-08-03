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
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const utils_1 = require("./utils");
const open = require("open");
const delay = require("delay");
const utils = new utils_1.default();
const ADB_DOWNLOAD_URL = "https://developer.android.com/studio/releases/platform-tools";
const notExistAdb = function () {
    return __awaiter(this, void 0, void 0, function* () {
        vscode.window.showErrorMessage("adb does not exist, please install, manually configure the environment", { modal: true });
        yield open(ADB_DOWNLOAD_URL).catch(_err => {
            console.error(`open ${ADB_DOWNLOAD_URL} failed`);
        });
    });
};
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let connectWlan = vscode.commands.registerCommand("android.adb.connect", () => __awaiter(this, void 0, void 0, function* () {
        const isExistAdb = utils.checkAdbExist(notExistAdb);
        const pickList = [];
        if (isExistAdb) {
            const devices = utils.checkDevices();
            if (devices.length === 0) {
                vscode.window.showWarningMessage("Please connect usb first");
                return;
            }
            pickList.push(...devices, "Restart adb");
            const picked = yield vscode.window.showQuickPick(pickList.map((val) => {
                var _a;
                return typeof val === "string" ? val :
                    `📱 ${(_a = val.model) === null || _a === void 0 ? void 0 : _a.replace('model:', "")} 🍰 ${val.device}\t\t${utils.isIp(val.device) ? "Connected" : ""}`;
            }));
            if (picked === undefined) {
                return;
            }
            if (picked === "Restart adb") {
                vscode.commands.executeCommand("android.adb.restart");
                return;
            }
            const port = yield vscode.window.showInputBox({
                value: "1031",
                placeHolder: "port (default:1031)",
                prompt: "Input Randomly" // 在输入框下方的提示信息
            });
            if (port === undefined) {
                return;
            }
            ;
            const isSet = yield utils.setTcpIpWithDevice(port, devices[0].device);
            if (!!!isSet) {
                return;
            }
            yield delay(2000);
            const addr = utils.getDeviceAddress(devices[0].device);
            let result;
            if (!!addr && addr.length !== 0) {
                result = yield vscode.window.showQuickPick(addr);
            }
            else {
                vscode.window.showWarningMessage("Not found address through usb please connect manually");
                result = yield vscode.window.showInputBox({
                    value: "",
                    prompt: "Input mobile phone intranet IP"
                });
            }
            if (!!result && result !== '') {
                utils
                    .connect(result, devices[0].device)
                    .then(() => {
                    vscode.window.showInformationMessage("Connect success, Pull out the USB", { modal: true });
                })
                    .catch((_err) => {
                    vscode.window.showErrorMessage(`Connect Error ${_err}`);
                });
            }
            else {
                vscode.window.showWarningMessage("Please input value");
            }
        }
    }));
    let restartServer = vscode.commands.registerCommand("android.adb.restart", () => __awaiter(this, void 0, void 0, function* () {
        try {
            vscode.window.showInformationMessage("Adb Restarting");
            yield utils.restartServer();
            vscode.window.showInformationMessage("Adb restart success", { modal: true });
        }
        catch (e) {
            vscode.window.showErrorMessage(e);
        }
    }));
    context.subscriptions.push(connectWlan, restartServer);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map