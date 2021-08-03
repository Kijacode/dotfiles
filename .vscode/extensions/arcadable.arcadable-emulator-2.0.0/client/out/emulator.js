"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Emulator = void 0;
const vscode = require("vscode");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const arcadable_shared_1 = require("arcadable-shared");
const compiler_1 = require("./compiler");
const exportArcadable_1 = require("arcadable-shared/out/model/exportArcadable");
const path = require("path");
const fs = require("fs");
class Emulator {
    constructor(log) {
        this.log = log;
        this.loadGameSubject = new rxjs_1.Subject();
        this.compileDoneSubject = new rxjs_1.BehaviorSubject(true);
        this.loadGameSubjectSubscription = rxjs_1.zip(this.compileDoneSubject, this.loadGameSubject.pipe(operators_1.auditTime(200))).subscribe(async ([done, currentPanel]) => {
            if (this.compileResult) {
                this.compileResult.game.stop();
            }
            if (this.instructionSubscription) {
                this.instructionSubscription.unsubscribe();
            }
            if (this.interruptionSubscription) {
                this.interruptionSubscription.unsubscribe();
            }
            await this.loadGame(currentPanel).then(() => {
                this.refreshView(currentPanel);
                this.compileDoneSubject.next(true);
            });
        });
    }
    openEmulatorWindow(context, column) {
        let currentPanel = this.initExtensionLayout(context, column);
        currentPanel.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case 'getPixelResult':
                    const color = message.color;
                    this.getPixelCallback(color);
                    return;
                case 'export': {
                    if (this.compileResult.game) {
                        (async () => {
                            this.log.append('Exported Arcadable script');
                            const startTime = process.hrtime();
                            const bytes = exportArcadable_1.exportArcadable(this.compileResult.game);
                            let path = this.exportPath;
                            if (path.charAt(path.length - 1) === '/') {
                                path = path.substr(0, path.length - 2);
                            }
                            fs.writeFile(vscode.workspace.rootPath + path + '/export.bin', bytes, (e) => {
                                this.log.appendLine('Write error: ' + e.message);
                            });
                            fs.writeFile(vscode.workspace.rootPath + path + '/export.json', `{
	"size": ${bytes.length},
	"data": "${bytes.reduce((acc, curr, i) => i === 0 ? curr : acc + ',' + curr, '')}"
}`, (e) => {
                                this.log.appendLine('Write error: ' + e.message);
                            });
                            const diff = process.hrtime(startTime);
                            const duration = Math.floor((diff[0] * 1000 + diff[1] / 1000000) * 1000) / 1000;
                            this.log.appendLine(' in ' + duration + 'ms.');
                            this.log.appendLine('Export size: ' + bytes.length + ' bytes.');
                            this.log.appendLine('Export path: ' + vscode.workspace.rootPath + path + '/export.json');
                            this.log.appendLine('Export path: ' + vscode.workspace.rootPath + path + '/export.bin');
                        })();
                    }
                    else {
                        this.log.appendLine('Cannot export, code probably has errors.');
                    }
                    return;
                }
                case 'digitalChanged': {
                    if (this.compileResult.game) {
                        this.compileResult.game.systemConfig.realTimeDigitalInputValues[message.index] = message.value ? 1 : 0;
                    }
                    return;
                }
                case 'analogChanged': {
                    if (this.compileResult.game) {
                        this.compileResult.game.systemConfig.realTimeAnalogInputValues[message.index] = message.value;
                    }
                    return;
                }
            }
        }, undefined, context.subscriptions);
        currentPanel.onDidDispose(() => {
            currentPanel = undefined;
            if (this.compileResult) {
                this.compileResult.game.stop();
            }
            if (this.instructionSubscription) {
                this.instructionSubscription.unsubscribe();
            }
            if (this.interruptionSubscription) {
                this.interruptionSubscription.unsubscribe();
            }
            if (this.onsaveSubscription) {
                this.onsaveSubscription.dispose();
            }
        }, null, context.subscriptions);
        currentPanel.onDidChangeViewState(e => {
            const visible = e.webviewPanel.visible;
            if (visible) {
                this.refreshView(currentPanel);
            }
        }, null, context.subscriptions);
        this.onsaveSubscription = vscode.workspace.onDidSaveTextDocument((document) => {
            if ((document.fileName.endsWith('.arc') || document.fileName.endsWith('arcadable.config.json')) && document.uri.scheme === 'file') {
                this.loadGameSubject.next(currentPanel);
            }
        });
        this.loadGameSubject.next(currentPanel);
        return currentPanel;
    }
    refreshView(currentPanel) {
        if (this.compileResult) {
            currentPanel.webview.postMessage({
                command: 'setDimensions',
                width: this.compileResult.game.systemConfig.screenWidth,
                height: this.compileResult.game.systemConfig.screenHeight
            });
            currentPanel.webview.postMessage({
                command: 'setInputs',
                digitalInputs: this.compileResult.game.systemConfig.digitalInputPinsAmount,
                analogInputs: this.compileResult.game.systemConfig.analogInputPinsAmount
            });
            currentPanel.webview.postMessage({
                command: 'setSpeakers',
                speakers: this.compileResult.game.systemConfig.speakerOutputAmount,
            });
        }
    }
    async loadGame(currentPanel) {
        this.log.clear();
        const startTime = process.hrtime();
        const compileResult = await this.compile();
        const diff = process.hrtime(startTime);
        const duration = Math.floor((diff[0] * 1000 + diff[1] / 1000000) * 1000) / 1000;
        if (!compileResult || !compileResult.game || compileResult.parseErrors.length > 0 || compileResult.compileErrors.length > 0) {
            this.log.appendLine('Arcadable compilation completed with errors in ' + duration + 'ms.');
            let error = 'Could not complete code compilation. ';
            if (!!compileResult) {
                if (compileResult.parseErrors.length > 0) {
                    error += compileResult.parseErrors.length + ' file parsing errors. ';
                }
                if (compileResult.compileErrors.length > 0) {
                    error += compileResult.compileErrors.length + ' compilation errors. ';
                }
            }
            vscode.window.showErrorMessage(error);
            if (!!compileResult) {
                if (compileResult.parseErrors.length > 0) {
                    this.log.appendLine('Parsing errors (' + compileResult.parseErrors.length + '):');
                    compileResult.parseErrors.forEach((e, i) => {
                        this.log.appendLine(i + ' - ' + e.file.replace(vscode.workspace.rootPath, '') + ':' + e.line + ':' + e.pos + ' - ' + e.error);
                    });
                }
                if (compileResult.compileErrors.length > 0) {
                    this.log.appendLine('Compile errors (' + compileResult.compileErrors.length + '):');
                    compileResult.compileErrors.forEach((e, i) => {
                        this.log.appendLine(i + ' - ' + e.file + ':' + e.line + ':' + e.pos + ' - ' + e.error);
                    });
                }
            }
        }
        else {
            vscode.window.showInformationMessage('Arcadable compiled successfully!');
            this.log.appendLine('Arcadable compilation completed successfully in ' + duration + 'ms.');
        }
        this.log.show();
        if (!!compileResult && compileResult.game && compileResult.parseErrors.length === 0 && compileResult.compileErrors.length === 0) {
            this.compileResult = compileResult;
            const game = this.compileResult.game;
            this.instructionSubscription = game.instructionEmitter.subscribe((instruction) => {
                if (instruction.command === 'getPixel') {
                    this.getPixelCallback = instruction.callback;
                }
                if (instruction.command === 'log') {
                    if (!isNaN(+instruction.value)) {
                        this.log.appendLine(instruction.value + '');
                    }
                    else if (instruction.value.length !== undefined && instruction.value.length > 0) {
                        const message = String.fromCharCode(...instruction.value);
                        this.log.appendLine(message);
                    }
                }
                else {
                    currentPanel.webview.postMessage(instruction);
                }
            });
            this.interruptionSubscription = game.interruptedEmitter.subscribe((interruption) => {
                if (interruption) {
                    this.instructionSubscription.unsubscribe();
                    this.interruptionSubscription.unsubscribe();
                    this.log.appendLine('Program interrupted.');
                    this.log.appendLine(interruption.message);
                    if (interruption.values.length > 0) {
                        this.log.appendLine('Values that could be involved with the interruption:');
                        interruption.values.forEach(v => {
                            compileResult.parsedProgram.compressedValues[v].linked.forEach(linked => {
                                this.log.appendLine(linked.file.replace(vscode.workspace.rootPath, '') + ':' + linked.line + ':' + linked.pos + ':' + linked.name);
                            });
                        });
                    }
                    if (interruption.instructions.length > 0) {
                        this.log.appendLine('Instructions that could be involved with the interruption:');
                        interruption.instructions.forEach(v => {
                            compileResult.parsedProgram.compressedInstructions[v].linked.forEach(linked => {
                                this.log.appendLine(linked.file.replace(vscode.workspace.rootPath, '') + ':' + linked.line + ':' + linked.pos);
                            });
                        });
                    }
                }
            });
            game.start();
        }
    }
    async compile() {
        const configUri = (await vscode.workspace.findFiles('arcadable.config.json'))[0];
        const configDoc = await vscode.workspace.openTextDocument(configUri);
        let config;
        if (configDoc) {
            config = JSON.parse(configDoc.getText());
            const configTest = this.checkConfig(config);
            if (configTest !== 'ok') {
                this.log.appendLine(configTest);
                return undefined;
            }
        }
        else {
            this.log.appendLine(`No config file found at path: "${vscode.workspace.rootPath}/arcadable.config.json"`);
            return undefined;
        }
        this.exportPath = config.project.export;
        const mainUri = (await vscode.workspace.findFiles(config.project.main))[0];
        const mainDoc = await vscode.workspace.openTextDocument(mainUri);
        if (!mainDoc) {
            this.log.appendLine(`No main file found at path: "${config.project.main}"`);
            return undefined;
        }
        const mainSplit = config.project.main.split('/');
        const mainFileName = mainSplit[mainSplit.length - 1];
        const mainPath = config.project.main.split(mainFileName)[0];
        const files = (await vscode.workspace.findFiles('**/*.arc'));
        let root = vscode.workspace.rootPath.replace(/\\/g, '/') + mainPath;
        if (root.charAt(0) !== '/') {
            root = '/' + root;
        }
        let docs = {
            'main': mainFileName,
            'root': root
        };
        await Promise.all(files.map((file) => new Promise((res, rej) => {
            vscode.workspace.openTextDocument(file).then(fileOpened => {
                docs[file.path] = fileOpened;
                res();
            });
        })));
        const conf = new arcadable_shared_1.SystemConfig(config.system.screenWidth, config.system.screenHeight, Math.floor(1000 / config.system.mainsPerSecond), Math.floor(1000 / config.system.rendersPerSecond), false, config.system.digitalInputAmount, config.system.analogInputAmount, config.system.speakerOutputAmount, 0);
        const compileResult = await new compiler_1.ArcadableCompiler(conf, docs).startCompile();
        return compileResult;
    }
    checkConfig(config) {
        let result = 'Config missing property: ';
        if (!config.project) {
            result += '"project", ';
        }
        else {
            if (!config.project.name) {
                result += '"project.name", ';
            }
            if (!config.project.version) {
                result += '"project.version", ';
            }
            if (!config.project.main) {
                result += '"project.main", ';
            }
            if (!config.project.export) {
                result += '"project.export", ';
            }
        }
        if (!config.system) {
            result += '"system", ';
        }
        else {
            if (!config.system.screenWidth) {
                result += '"system.screenWidth", ';
            }
            if (!config.system.screenHeight) {
                result += '"system.screenHeight", ';
            }
            if (!config.system.mainsPerSecond) {
                result += '"system.mainsPerSecond", ';
            }
            if (!config.system.rendersPerSecond) {
                result += '"system.rendersPerSecond", ';
            }
            if (!config.system.digitalInputAmount) {
                result += '"system.digitalInputAmount", ';
            }
            if (!config.system.analogInputAmount) {
                result += '"system.analogInputAmount", ';
            }
            if (!config.system.speakerOutputAmount) {
                result += '"system.speakerOutputAmount", ';
            }
        }
        if (result === 'Config missing property: ') {
            result = 'ok';
        }
        return result;
    }
    initExtensionLayout(context, columnToShowIn) {
        const currentPanel = vscode.window.createWebviewPanel('ArcadableEmulator', 'Arcadable Emulator', columnToShowIn, {
            enableScripts: true
        });
        const templateFilePath = vscode.Uri.file(path.join(context.extensionPath, 'client', 'src', 'html', 'index.html'));
        const styleSrcUrl = currentPanel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'client', 'src', 'css', 'style.css'))).toString();
        const mainScriptSrcUrl = currentPanel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'client', 'src', 'js', 'main.js'))).toString();
        const drawFunctionsScriptSrcUrl = currentPanel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'client', 'src', 'js', 'drawFunctions.js'))).toString();
        const beepScriptSrcUrl = currentPanel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'client', 'src', 'js', 'beep.js'))).toString();
        currentPanel.webview.html = fs.readFileSync(templateFilePath.fsPath, 'utf8')
            .replace('{{styleSrc}}', styleSrcUrl)
            .replace('{{mainScriptSrc}}', mainScriptSrcUrl)
            .replace('{{beepScriptSrc}}', beepScriptSrcUrl)
            .replace('{{functionScriptSrc}}', drawFunctionsScriptSrcUrl);
        return currentPanel;
    }
}
exports.Emulator = Emulator;
//# sourceMappingURL=emulator.js.map