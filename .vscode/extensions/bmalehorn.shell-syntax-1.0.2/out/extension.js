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
exports.activate = void 0;
const child_process_1 = require("child_process");
const vscode = require("vscode");
const vscode_1 = require("vscode");
let diagnostics;
/**
 * Activate this extension.
 *
 * @param context The context for this extension
 * @return A promise for the initialization
 */
exports.activate = (context) => __awaiter(void 0, void 0, void 0, function* () {
    diagnostics = vscode.languages.createDiagnosticCollection("bash");
    context.subscriptions.push(diagnostics);
    vscode.workspace.onDidOpenTextDocument(lintDocument, null, context.subscriptions);
    vscode.workspace.onDidSaveTextDocument(lintDocument, null, context.subscriptions);
    vscode.workspace.textDocuments.forEach(lintDocument);
    // Remove diagnostics for closed files
    vscode.workspace.onDidCloseTextDocument((d) => diagnostics.delete(d.uri), null, context.subscriptions);
});
const lintDocument = (document) => __awaiter(void 0, void 0, void 0, function* () {
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
    const format = shellType(document);
    if (format === "bash") {
        const result = yield runInWorkspace(workspaceFolder, [
            "bash",
            "-n",
            document.fileName,
        ]);
        const d = bashOutputToDiagnostics(document, result.stderr);
        diagnostics.set(document.uri, d);
    }
    else if (format === "zsh") {
        const result = yield runInWorkspace(workspaceFolder, [
            "zsh",
            "-n",
            document.fileName,
        ]);
        const d = zshOutputToDiagnostics(document, result.stderr);
        diagnostics.set(document.uri, d);
    }
    else if (format === "sh") {
        const result = yield runInWorkspace(workspaceFolder, [
            "sh",
            "-n",
            document.fileName,
        ]);
        const d = shOutputToDiagnostics(document, result.stderr);
        diagnostics.set(document.uri, d);
    }
});
const shellType = (document) => {
    if (isSavedShebangBashDocument(document)) {
        return "bash";
    }
    else if (isSavedZshDocument(document)) {
        return "zsh";
    }
    else if (isSavedShebangShDocument(document)) {
        // if we see #!/bin/sh, it will be run by sh, not bash.
        // Check sh syntax instead - this is a common gotcha.
        return "sh";
    }
    else if (isSavedShellDocument(document)) {
        const defaultShell = vscode.workspace
            .getConfiguration("shell-syntax")
            .get("defaultShell");
        // Compromise: assume all other shell scripts = bash.
        // e.g. file.sh will be parsed as bash.
        // This is because a lot of people have .sh files that actually
        // *are* bash, but they don't signal this accurately through file
        // extensions or shebangs.
        return defaultShell || "bash";
    }
};
/**
 * Parse bash errors from bash output for a given document.
 *
 * @param document The document to whose contents errors refer
 * @param output The error output from bash.
 * @return An array of all diagnostics
 */
const bashOutputToDiagnostics = (document, output) => {
    const diagnostics = [];
    const matches = getMatches(/^(.+): line (\d+): (.+)$/, output);
    for (const match of matches) {
        const lineNumber = Number.parseInt(match[2]);
        const message = match[3];
        const range = document.validateRange(new vscode_1.Range(lineNumber - 1, 0, lineNumber - 1, Number.MAX_VALUE));
        const diagnostic = new vscode_1.Diagnostic(range, message);
        diagnostic.source = "bash";
        diagnostics.push(diagnostic);
    }
    return diagnostics;
};
/**
 * Parse bash errors from bash output for a given document.
 *
 * @param document The document to whose contents errors refer
 * @param output The error output from bash.
 * @return An array of all diagnostics
 */
const zshOutputToDiagnostics = (document, output) => {
    const diagnostics = [];
    // /home/brian/vscode-shell-syntax/sample.zsh:5: parse error near `fi'
    const matches = getMatches(/^(.+):(\d+): (.+)$/, output);
    for (const match of matches) {
        const lineNumber = Number.parseInt(match[2]);
        const message = match[3];
        const range = document.validateRange(new vscode_1.Range(lineNumber - 1, 0, lineNumber - 1, Number.MAX_VALUE));
        const diagnostic = new vscode_1.Diagnostic(range, message);
        diagnostic.source = "zsh";
        diagnostics.push(diagnostic);
    }
    return diagnostics;
};
const shOutputToDiagnostics = (document, output) => {
    const diagnostics = [];
    // /home/brian/vscode-shell-syntax/sample.sh: 5: Syntax error: "fi" unexpected
    const matches = getMatches(/^(.+): *(line)? *(\d+): (.+)$/, output);
    for (const match of matches) {
        const lineNumber = Number.parseInt(match[3]);
        const message = match[4];
        const range = document.validateRange(new vscode_1.Range(lineNumber - 1, 0, lineNumber - 1, Number.MAX_VALUE));
        const diagnostic = new vscode_1.Diagnostic(range, message);
        diagnostic.source = "sh";
        diagnostics.push(diagnostic);
    }
    return diagnostics;
};
/**
 * Whether a given document is saved to disk and in shell language.
 *
 * @param document The document to check
 * @return Whether the document is a shell document saved to disk
 */
const isSavedShellDocument = (document) => !document.isDirty &&
    0 <
        vscode.languages.match({
            language: "shellscript",
            scheme: "file",
        }, document);
const isSavedShebangBashDocument = (document) => {
    if (!isSavedShellDocument(document)) {
        return false;
    }
    const suffixes = [
        ".bashrc",
        "bashrc",
        ".bash_login",
        ".bash_logout",
        ".bash_profile",
    ];
    if (suffixes.some((suffix) => document.fileName.endsWith(suffix))) {
        return true;
    }
    // #!/bin/bash
    const firstTextLine = document.lineAt(0);
    const textRange = new vscode_1.Range(firstTextLine.range.start, firstTextLine.range.end);
    const firstLine = document.getText(textRange);
    if (firstLine.match(/^#!.*\b(bash)\b.*/)) {
        return true;
    }
    return false;
};
const isSavedZshDocument = (document) => {
    if (!isSavedShellDocument(document)) {
        return false;
    }
    // .zshrc
    const extensions = [
        ".zsh",
        ".zshrc",
        ".zprofile",
        ".zlogin",
        ".zlogout",
        ".zshenv",
        ".zsh-theme",
    ];
    if (extensions.some((extension) => document.fileName.endsWith(extension))) {
        return true;
    }
    // #!/usr/bin/zsh
    const firstTextLine = document.lineAt(0);
    const textRange = new vscode_1.Range(firstTextLine.range.start, firstTextLine.range.end);
    const firstLine = document.getText(textRange);
    if (firstLine.match(/^#!.*\b(zsh).*/)) {
        return true;
    }
    return false;
};
const isSavedShebangShDocument = (document) => {
    if (!isSavedShellDocument(document)) {
        return false;
    }
    // #!/usr/bin/sh
    const firstTextLine = document.lineAt(0);
    const textRange = new vscode_1.Range(firstTextLine.range.start, firstTextLine.range.end);
    const firstLine = document.getText(textRange);
    if (firstLine.match(/^#!.*\b(sh)\b.*/)) {
        return true;
    }
    return false;
};
/**
 * Whether an error is a system error.
 *
 * @param error The error to check
 */
const isSystemError = (error) => error.errno !== undefined &&
    typeof error.errno === "string";
/**
 * Whether an error is a process error.
 */
const isProcessError = (error) => !isSystemError(error) &&
    error.code !== undefined &&
    error.code > 0;
/**
 * Run a command in a given workspace folder.
 *
 * If the workspace folder is undefined run the command in the working directory
 * if the vscode instance.
 *
 * @param folder The folder to run the command in
 * @param command The command array
 * @param stdin An optional string to feed to standard input
 * @return The result of the process as promise
 */
const runInWorkspace = (folder, command, stdin) => new Promise((resolve, reject) => {
    const cwd = folder ? folder.uri.fsPath : process.cwd();
    const child = child_process_1.execFile(command[0], command.slice(1), { cwd }, (error, stdout, stderr) => {
        if (error && !isProcessError(error)) {
            // Throw system errors, but do not fail if the command
            // fails with a non-zero exit code.
            console.error("Command error", command, error);
            reject(error);
        }
        else {
            const exitCode = error ? error.code : 0;
            resolve({ stdout, stderr, exitCode });
        }
    });
    if (stdin && child.stdin) {
        child.stdin.end(stdin);
    }
});
/**
 * Exec pattern against the given text and return an array of all matches.
 *
 * @param pattern The pattern to match against
 * @param text The text to match the pattern against
 * @return All matches of pattern in text.
 */
const getMatches = (pattern, text) => {
    const out = [];
    const lines = text.split("\n");
    for (const line of lines) {
        const match = line.match(pattern);
        if (match) {
            out.push(match);
        }
    }
    return out;
};
//# sourceMappingURL=extension.js.map