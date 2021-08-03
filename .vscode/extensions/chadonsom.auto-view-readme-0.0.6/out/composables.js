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
exports.lastLevelOfPath = exports.recursivelyFindReadme = exports.parentPath = exports.currentPath = exports.readmeForPath = void 0;
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable curly */
const vscode_1 = require("vscode");
const fs_1 = require("fs");
/**
 * Get the Uri for the readme file in a directory, if it exists
 *
 * @param path path to check for a readme
 */
function readmeForPath(path) {
    let readme, result;
    let candidates = ['readme.md', 'README.md'];
    for (let candidate of candidates) {
        if (readme === undefined) {
            result = `${path}/${candidate}`;
            if (fs_1.existsSync(result))
                readme = vscode_1.Uri.file(result);
        }
    }
    return readme;
}
exports.readmeForPath = readmeForPath;
/**
 * Determine the current path, from either the `activeTextEditor`, or the `workspaceFolder`
 */
function currentPath() {
    var _a, _b, _c, _d, _e;
    let current = (_b = (_a = vscode_1.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document) === null || _b === void 0 ? void 0 : _b.fileName;
    if (current)
        current = current.split('/').slice(0, -1).join('/');
    else
        current = (_e = (_d = (_c = vscode_1.workspace.workspaceFolders) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.uri) === null || _e === void 0 ? void 0 : _e.fsPath;
    return current;
}
exports.currentPath = currentPath;
/**
 * Get the parent path of a path (move up)
 * @param path path to get the parent path of
 */
function parentPath(path) {
    return path.split('/').slice(0, -1).join('/');
}
exports.parentPath = parentPath;
function recursivelyFindReadme(path) {
    return __awaiter(this, void 0, void 0, function* () {
        let readme = readmeForPath(path);
        if (readme)
            return readme;
        let parent = parentPath(path);
        if (!parent)
            return;
        let confirm = yield vscode_1.window.showQuickPick(["Okay", "Cancel"], {
            placeHolder: `No readme was found in ${lastLevelOfPath(path)}. Search in ${lastLevelOfPath(parent)}?`
        });
        if (confirm === "Okay")
            return recursivelyFindReadme(parent);
        return;
    });
}
exports.recursivelyFindReadme = recursivelyFindReadme;
function lastLevelOfPath(path) {
    let split = path.split('/');
    return split[split.length - 1];
}
exports.lastLevelOfPath = lastLevelOfPath;
//# sourceMappingURL=composables.js.map