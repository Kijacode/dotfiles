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
exports.readPackageJson = exports.getDefaultPackageJson = void 0;
const vscode = require("vscode");
const fs = require("fs");
function getPackageJson(folder) {
    return __awaiter(this, void 0, void 0, function* () {
        return vscode.workspace.findFiles(new vscode.RelativePattern(folder, 'package.json'), null, 1, null);
    });
}
function getDefaultPackageJson() {
    return {
        npmStart: true,
        fullCommand: 'npm start',
        cmd: 'npm start',
        author: 'author',
        version: '0.0.1',
        artifactName: ''
    };
}
exports.getDefaultPackageJson = getDefaultPackageJson;
function readPackageJson(folder) {
    return __awaiter(this, void 0, void 0, function* () {
        // open package.json and look for main, scripts start
        const uris = yield getPackageJson(folder);
        var pkg = getDefaultPackageJson(); //default
        if (uris && uris.length > 0) {
            const json = JSON.parse(fs.readFileSync(uris[0].fsPath, 'utf8'));
            if (json.scripts && json.scripts.start) {
                pkg.npmStart = true;
                pkg.fullCommand = json.scripts.start;
                pkg.cmd = 'npm start';
            }
            else if (json.main) {
                pkg.npmStart = false;
                pkg.fullCommand = 'node' + ' ' + json.main;
                pkg.cmd = pkg.fullCommand;
            }
            else {
                pkg.fullCommand = '';
            }
            if (json.author) {
                pkg.author = json.author;
            }
            if (json.version) {
                pkg.version = json.version;
            }
        }
        return pkg;
    });
}
exports.readPackageJson = readPackageJson;
//# sourceMappingURL=package-json.js.map