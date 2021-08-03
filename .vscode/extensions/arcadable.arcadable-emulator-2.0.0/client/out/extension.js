"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const path = require("path");
const vscode_languageclient_1 = require("vscode-languageclient");
const vscode = require("vscode");
const emulator_1 = require("./emulator");
let client;
function activate(context) {
    let currentPanel = undefined;
    let emulator;
    let serverModule = context.asAbsolutePath(path.join('server', 'out', 'server.js'));
    let debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };
    let serverOptions = {
        run: {
            module: serverModule,
            transport: vscode_languageclient_1.TransportKind.ipc
        },
        debug: {
            module: serverModule,
            transport: vscode_languageclient_1.TransportKind.ipc,
            options: debugOptions
        }
    };
    let clientOptions = {
        documentSelector: [{ scheme: 'file', language: 'arcadable' }],
    };
    client = new vscode_languageclient_1.LanguageClient('ArcadableServer', 'Arcadable Server', serverOptions, clientOptions);
    client.start();
    const arcLog = vscode.window.createOutputChannel("Arcadable");
    emulator = new emulator_1.Emulator(arcLog);
    let disposable = vscode.commands.registerCommand('arcadable-emulator.start', () => {
        if (currentPanel && !currentPanel._store._isDisposed) {
            currentPanel.reveal(vscode.ViewColumn.Beside);
            emulator.refreshView(currentPanel);
        }
        else {
            currentPanel = emulator.openEmulatorWindow(context, vscode.ViewColumn.Beside);
            emulator.refreshView(currentPanel);
        }
        currentPanel.onDidDispose(() => {
            if (emulator.compileResult.game) {
                emulator.compileResult.game.stop();
            }
            currentPanel = null;
        });
    });
}
exports.activate = activate;
function deactivate() {
    if (!client) {
        return undefined;
    }
    return client.stop();
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map