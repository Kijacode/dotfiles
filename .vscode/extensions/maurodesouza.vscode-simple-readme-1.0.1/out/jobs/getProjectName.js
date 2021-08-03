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
const vscode_1 = require("vscode");
exports.default = (currentUri) => __awaiter(void 0, void 0, void 0, function* () {
    const pattern = 'package.json';
    let projectName = '';
    let packageUri = undefined;
    const [packageCurrentUri] = yield vscode_1.workspace.findFiles({
        base: currentUri.path,
        pattern,
    });
    if (packageCurrentUri) {
        packageUri = packageCurrentUri;
    }
    const rootFolderUri = vscode_1.workspace.workspaceFolders[0].uri;
    const [packageRootFolder] = yield vscode_1.workspace.findFiles({
        base: rootFolderUri.path,
        pattern,
    });
    if (packageRootFolder && packageUri === undefined) {
        packageUri = packageRootFolder;
    }
    if (packageUri) {
        const contentInBytes = yield vscode_1.workspace.fs.readFile(packageUri);
        const content = contentInBytes.toString();
        const packageFile = JSON.parse(content);
        projectName = packageFile.name;
    }
    else {
        projectName = vscode_1.workspace.workspaceFolders[0].name;
    }
    return projectName;
});
//# sourceMappingURL=getProjectName.js.map