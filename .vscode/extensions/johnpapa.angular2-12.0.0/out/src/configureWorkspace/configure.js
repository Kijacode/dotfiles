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
exports.configure = void 0;
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const files_1 = require("./files");
const prompts_1 = require("./prompts");
const FILE_TYPES = {
    'index.js': files_1.getSimpleExpressFile
};
const YES_OR_NO_PROMPT = [
    {
        title: 'Yes',
        isCloseAffordance: false
    },
    {
        title: 'No',
        isCloseAffordance: true
    }
];
function configure() {
    return __awaiter(this, void 0, void 0, function* () {
        let folder;
        if (vscode.workspace.workspaceFolders &&
            vscode.workspace.workspaceFolders.length === 1) {
            folder = vscode.workspace.workspaceFolders[0];
        }
        else {
            folder = yield vscode.window.showWorkspaceFolderPick();
        }
        if (!folder) {
            if (!vscode.workspace.workspaceFolders) {
                vscode.window.showErrorMessage('Express files can only be generated if VS Code is opened on a folder.');
            }
            else {
                vscode.window.showErrorMessage('Express files can only be generated if a workspace folder is picked in VS Code.');
            }
            return;
        }
        const platformType = 'Node.js';
        const port = yield prompts_1.promptForPort();
        if (!port)
            return;
        const folderToServe = yield prompts_1.promptForFolderToServe();
        if (!folderToServe)
            return;
        const nodeFileToSave = yield prompts_1.promptForNodeExpressFile();
        if (!nodeFileToSave)
            return;
        const serviceName = path.basename(folder.uri.fsPath).toLowerCase();
        yield Promise.all(Object.keys(FILE_TYPES).map(fileName => {
            return createWorkspaceFileIfNotExists(nodeFileToSave, FILE_TYPES[fileName]);
        }));
        function createWorkspaceFileIfNotExists(fileName, writerFunction) {
            return __awaiter(this, void 0, void 0, function* () {
                const workspacePath = path.join(folder.uri.fsPath, fileName);
                if (fs.existsSync(workspacePath)) {
                    const item = yield vscode.window.showErrorMessage(`A ${fileName} already exists. Would you like to override it?`, ...YES_OR_NO_PROMPT);
                    if (item.title.toLowerCase() === 'yes') {
                        fs.writeFileSync(workspacePath, writerFunction(port, folderToServe), {
                            encoding: 'utf8'
                        });
                    }
                }
                else {
                    fs.writeFileSync(workspacePath, writerFunction(port, folderToServe), {
                        encoding: 'utf8'
                    });
                }
            });
        }
    });
}
exports.configure = configure;
//# sourceMappingURL=configure.js.map