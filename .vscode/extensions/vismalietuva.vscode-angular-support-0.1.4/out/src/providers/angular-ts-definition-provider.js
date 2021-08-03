"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const path = require("path");
const fs = require("fs");
class AngularTsDefinitionProvider {
    provideDefinition(document, position, token) {
        // Apply this provider only on specific lines
        const linesFilter = ['templateUrl', 'styleUrls'];
        const lineText = document.lineAt(position).text;
        if (linesFilter.every(l => lineText.indexOf(l) === -1)) {
            return null;
        }
        // Parse potential file name
        const fileNameRegex = /([\w\.\/\-]+)/;
        const potentialFileNameRange = document.getWordRangeAtPosition(position, fileNameRegex);
        if (!potentialFileNameRange) {
            return null;
        }
        const potentialFileName = document.getText(potentialFileNameRange);
        const workingDir = path.dirname(document.fileName);
        const fullPath = path.resolve(workingDir, potentialFileName);
        if (fs.existsSync(fullPath)) {
            return new vscode_1.Location(vscode_1.Uri.file(fullPath), new vscode_1.Position(0, 0));
        }
        return null;
    }
}
exports.AngularTsDefinitionProvider = AngularTsDefinitionProvider;
//# sourceMappingURL=angular-ts-definition-provider.js.map