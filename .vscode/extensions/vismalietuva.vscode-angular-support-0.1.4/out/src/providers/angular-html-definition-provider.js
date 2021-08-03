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
const vscode_1 = require("vscode");
const ts = require("typescript");
const utils = require("../utils");
const typescript_syntax_parser_1 = require("../parsers/typescript-syntax-parser");
class AngularHtmlDefinitionProvider {
    provideDefinition(document, position, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const lineText = document.lineAt(position).text;
            const propertyRegexps = [
                // Interpolation. ex: {{ myProp }}
                /({{)([^}]+)}}/g,
                // Input attributes. ex: [(...)]="myProp"
                /(\[\(?[\w\.\-?]*\)?\]=")([^"]+)"/g,
                // Output attributes. ex: (...)="myMethod(...)"
                /(\([\w\.]*\)=")([^"]+)"/g,
                // Structural attributes. ex: *ngIf="myProp"
                /(\*\w+=")([^"]+)"/g
            ];
            const propertyMatch = utils.parseByLocationRegexps(lineText, position.character, propertyRegexps);
            if (!!propertyMatch) {
                return yield this.propertyDefinition(document, position);
            }
            // Element. ex: <my-element ...>...</my-element>
            const elementRegexp = /(<\/?)([a-zA-Z0-9-]+)/g;
            const elementMatch = utils.parseByLocationRegexp(lineText, position.character, elementRegexp);
            if (!!elementMatch) {
                return yield this.elementDefinition(elementMatch);
            }
            return null;
        });
    }
    elementDefinition(selector) {
        return __awaiter(this, void 0, void 0, function* () {
            const expectedFileName = `**/${selector.replace(/(\w+-)/, (f) => '')}.component.ts`;
            const foundFiles = yield vscode_1.workspace.findFiles(expectedFileName, '**∕node_modules∕**', 2);
            // To be sure of defition origin return only when there is one match.
            if (foundFiles.length === 1) {
                return new vscode_1.Location(vscode_1.Uri.file(foundFiles[0].path), new vscode_1.Position(0, 0));
            }
            return null;
        });
    }
    propertyDefinition(document, position) {
        return __awaiter(this, void 0, void 0, function* () {
            const range = document.getWordRangeAtPosition(position, /[$\w]+/);
            if (!range)
                return null;
            const propertyName = document.getText(range);
            const componentFilePath = document.fileName.substr(0, document.fileName.lastIndexOf('.')) + '.ts';
            const sourceFile = yield typescript_syntax_parser_1.TypescriptSyntaxParser.parseSourceFile(componentFilePath);
            if (!sourceFile)
                return null;
            const recursiveSyntaxKinds = [ts.SyntaxKind.ClassDeclaration, ts.SyntaxKind.Constructor];
            const foundNode = typescript_syntax_parser_1.TypescriptSyntaxParser.findNode(sourceFile, (node) => {
                let declaration = node;
                switch (node.kind) {
                    case ts.SyntaxKind.PropertyDeclaration:
                    case ts.SyntaxKind.MethodDeclaration:
                    case ts.SyntaxKind.GetAccessor:
                    case ts.SyntaxKind.SetAccessor:
                        return declaration.name.getText() === propertyName;
                    case ts.SyntaxKind.Parameter:
                        const publicAccessor = typescript_syntax_parser_1.TypescriptSyntaxParser.findNode(node, (cn) => cn.kind === ts.SyntaxKind.PublicKeyword);
                        return node.parent.kind == ts.SyntaxKind.Constructor
                            && declaration.name.getText() === propertyName
                            && !!publicAccessor;
                }
                return false;
            }, recursiveSyntaxKinds);
            if (!foundNode)
                return null;
            const declarationPos = typescript_syntax_parser_1.TypescriptSyntaxParser.parsePosition(sourceFile, foundNode.name.getStart());
            if (!declarationPos)
                return null;
            return new vscode_1.Location(vscode_1.Uri.file(componentFilePath), declarationPos);
        });
    }
}
exports.AngularHtmlDefinitionProvider = AngularHtmlDefinitionProvider;
//# sourceMappingURL=angular-html-definition-provider.js.map