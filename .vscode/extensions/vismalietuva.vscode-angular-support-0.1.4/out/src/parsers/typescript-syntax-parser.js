"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const fs = require("fs");
const ts = require("typescript");
const path = require("path");
class TypescriptSyntaxParser {
    static parseSourceFile(sourceFilePath) {
        return __awaiter(this, void 0, void 0, function* () {
            if (fs.existsSync(sourceFilePath)) {
                const document = yield vscode.workspace.openTextDocument(sourceFilePath);
                const text = document.getText();
                return this.getSourceFile(sourceFilePath, text);
            }
            return null;
        });
    }
    static findNode(rootNode, predicate, recursiveNodes) {
        let result = null;
        ts.forEachChild(rootNode, (child) => {
            // Already found, skip.
            if (result)
                return;
            if (recursiveNodes && recursiveNodes.indexOf(child.kind) !== -1) {
                result = this.findNode(child, predicate, recursiveNodes);
            }
            else {
                result = predicate(child) ? child : null;
            }
        });
        return result;
    }
    static parsePosition(sourceFile, position) {
        // Parse position
        const lineAndChar = ts.getLineAndCharacterOfPosition(sourceFile, position);
        if (!lineAndChar)
            return null;
        return new vscode.Position(lineAndChar.line, lineAndChar.character);
    }
    static getSourceFile(fileName, source) {
        let sourceFile = this.decompileFile(fileName, source);
        if (sourceFile === undefined) {
            const INVALID_SOURCE_ERROR = `Invalid source file: ${fileName}. Ensure that the files supplied to lint have a .ts, .tsx, .js or .jsx extension.`;
            throw new Error(INVALID_SOURCE_ERROR);
        }
        return sourceFile;
    }
    static decompileFile(fileName, source) {
        const normalizedName = path.normalize(fileName).replace(/\\/g, '/');
        const compilerOptions = {
            allowJs: true,
            noResolve: true,
            target: ts.ScriptTarget.ES5,
        };
        const compilerHost = {
            fileExists: () => true,
            getCanonicalFileName: (filename) => filename,
            getCurrentDirectory: () => "",
            getDefaultLibFileName: () => "lib.d.ts",
            getDirectories: (_path) => [],
            getNewLine: () => "\n",
            getSourceFile: (filenameToGet) => {
                const target = compilerOptions.target == null ? ts.ScriptTarget.ES5 : compilerOptions.target;
                return ts.createSourceFile(filenameToGet, source, target, true);
            },
            readFile: (x) => x,
            useCaseSensitiveFileNames: () => true,
            writeFile: (x) => x,
        };
        const program = ts.createProgram([normalizedName], compilerOptions, compilerHost);
        return program.getSourceFile(normalizedName);
    }
}
exports.TypescriptSyntaxParser = TypescriptSyntaxParser;
//# sourceMappingURL=typescript-syntax-parser.js.map