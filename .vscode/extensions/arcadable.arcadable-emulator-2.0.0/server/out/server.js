"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_1 = require("vscode-languageserver");
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
const arcadable_shared_1 = require("arcadable-shared/");
let connection = vscode_languageserver_1.createConnection(vscode_languageserver_1.ProposedFeatures.all);
let documents = new vscode_languageserver_1.TextDocuments(vscode_languageserver_textdocument_1.TextDocument);
let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;
let hasDiagnosticRelatedInformationCapability = false;
connection.onInitialize((params) => {
    let capabilities = params.capabilities;
    hasConfigurationCapability = !!(capabilities.workspace && !!capabilities.workspace.configuration);
    hasWorkspaceFolderCapability = !!(capabilities.workspace && !!capabilities.workspace.workspaceFolders);
    hasDiagnosticRelatedInformationCapability = !!(capabilities.textDocument &&
        capabilities.textDocument.publishDiagnostics &&
        capabilities.textDocument.publishDiagnostics.relatedInformation);
    const result = {
        capabilities: {
            textDocumentSync: vscode_languageserver_1.TextDocumentSyncKind.Incremental,
            completionProvider: {
                resolveProvider: true
            }
        }
    };
    if (hasWorkspaceFolderCapability) {
        result.capabilities.workspace = {
            workspaceFolders: {
                supported: true
            }
        };
    }
    return result;
});
connection.onInitialized(() => {
    if (hasConfigurationCapability) {
        connection.client.register(vscode_languageserver_1.DidChangeConfigurationNotification.type, undefined);
    }
    if (hasWorkspaceFolderCapability) {
        connection.workspace.onDidChangeWorkspaceFolders(_event => {
        });
    }
});
let timeSinceChange = 0;
documents.onDidChangeContent(change => {
    timeSinceChange = new Date().getTime();
    setTimeout(() => {
        const currMillis = new Date().getTime();
        if (currMillis - timeSinceChange >= 995) {
            validateTextDocument(change.document);
        }
    }, 1000);
});
async function validateTextDocument(textDocument) {
    let diagnostics = [];
    const data = new arcadable_shared_1.ArcadableParser().parse(textDocument.uri, textDocument.getText().split(/\n/g));
    const functionParseResultExecutables = {
        file: data.filePath,
        executables: data.functionParseResults
    };
    functionParseResultExecutables.executables.forEach(executable => {
        const functions = executable();
        data.errors.push(...functions
            .reduce((acc, curr) => [...acc, ...curr.errors.map(err => ({
                file: functionParseResultExecutables.file,
                line: err.line,
                pos: err.pos,
                error: err.error
            }))], []));
    });
    data.errors.forEach(e => {
        let diagnostic = {
            severity: vscode_languageserver_1.DiagnosticSeverity.Error,
            range: {
                start: { line: e.line - 1, character: e.pos },
                end: { line: e.line - 1, character: e.pos }
            },
            message: e.error,
            source: 'arc'
        };
        diagnostics.push(diagnostic);
    });
    connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}
connection.onCompletion((_textDocumentPosition) => {
    return [
        ...arcadable_shared_1.valueTypes.filter(v => !!v.codeValue).map(v => ({ label: v.codeValue, detail: v.viewValue, data: v.value, kind: vscode_languageserver_1.CompletionItemKind.TypeParameter })),
        ...arcadable_shared_1.instructionTypes.map(i => ({ label: i.codeValue, detail: i.viewValue, data: i.value, kind: vscode_languageserver_1.CompletionItemKind.Function }))
    ];
});
connection.onCompletionResolve((item) => {
    return item;
});
documents.listen(connection);
connection.listen();
//# sourceMappingURL=server.js.map