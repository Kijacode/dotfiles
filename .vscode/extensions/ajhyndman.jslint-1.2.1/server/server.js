/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
"use strict";
var vscode_languageserver_1 = require('vscode-languageserver');
var fs = require('fs');
var path = require('path');
var minimatch = require('minimatch');
var _ = require('lodash');
var processIgnoreFile = require('parse-gitignore');
function makeDiagnostic(problem) {
    // Setting errors (and potentially global file errors) will report on line zero, char zero.
    // Ensure that the start and end are >=0 (gets dropped by one in the return)
    if (problem.line <= 0) {
        problem.line = 1;
    }
    if (problem.character <= 0) {
        problem.character = 1;
    }
    return {
        message: problem.reason + (problem.code ? " (" + problem.code + ")" : ''),
        severity: getSeverity(problem),
        source: 'jslint',
        code: problem.code,
        range: {
            start: { line: problem.line - 1, character: problem.character - 1 },
            end: { line: problem.line - 1, character: problem.character - 1 }
        }
    };
}
function getSeverity(problem) {
    // If there is no code (that would be very odd) we'll push it as an error as well.
    // See http://jsLint.com/docs/ (search for error. It is only mentioned once.)
    if (!problem.code || problem.code[0] === 'E') {
        return vscode_languageserver_1.DiagnosticSeverity.Error;
    }
    return vscode_languageserver_1.DiagnosticSeverity.Warning;
}
function locateFile(directory, fileName) {
    var parent = directory;
    do {
        directory = parent;
        var location_1 = path.join(directory, fileName);
        if (fs.existsSync(location_1)) {
            return location_1;
        }
        parent = path.dirname(directory);
    } while (parent !== directory);
    return undefined;
}
;
var JSLINTRC = 'jslint.conf';
var OptionsResolver = (function () {
    function OptionsResolver(connection) {
        this.connection = connection;
        this.clear();
        this.configPath = null;
        this.jslintOptions = null;
    }
    OptionsResolver.prototype.setVersion = function (version) {
        this.version = version;
    };
    OptionsResolver.prototype.getVersion = function () {
        return this.version;
    };
    OptionsResolver.prototype.configure = function (path, jslintOptions) {
        this.optionsCache = Object.create(null);
        this.configPath = path;
        this.jslintOptions = jslintOptions;
    };
    OptionsResolver.prototype.clear = function (jslintOptions) {
        this.optionsCache = Object.create(null);
    };
    OptionsResolver.prototype.getOptions = function (fsPath) {
        var result = this.optionsCache[fsPath];
        if (!result) {
            result = this.readOptions(fsPath);
            this.optionsCache[fsPath] = result;
        }
        return result;
    };
    OptionsResolver.prototype.readOptions = function (fsPath) {
        if (fsPath === void 0) { fsPath = null; }
        var that = this;
        function stripComments(content) {
            /**
            * First capturing group matches double quoted string
            * Second matches single quotes string
            * Third matches block comments
            * Fourth matches line comments
            */
            var regexp = /("(?:[^\\\"]*(?:\\.)?)*")|('(?:[^\\\']*(?:\\.)?)*')|(\/\*(?:\r?\n|.)*?\*\/)|(\/{2,}.*?(?:(?:\r?\n)|$))/g;
            var result = content.replace(regexp, function (match, m1, m2, m3, m4) {
                // Only one of m1, m2, m3, m4 matches
                if (m3) {
                    // A block comment. Replace with nothing
                    return "";
                }
                else if (m4) {
                    // A line comment. If it ends in \r?\n then keep it.
                    var length_1 = m4.length;
                    if (length_1 > 2 && m4[length_1 - 1] === '\n') {
                        return m4[length_1 - 2] === '\r' ? '\r\n' : '\n';
                    }
                    else {
                        return "";
                    }
                }
                else {
                    // We match a string
                    return match;
                }
            });
            return result;
        }
        ;
        function readJsonFile(file, extendedFrom) {
            try {
                return JSON.parse(stripComments(fs.readFileSync(file).toString()));
            }
            catch (err) {
                var location_2 = extendedFrom ? file + " extended from " + extendedFrom : file;
                that.connection.window.showErrorMessage("Can't load JSLint configuration from file " + location_2 + ". Please check the file for syntax errors.");
                return {};
            }
        }
        function readJSLintFile(file, extendedFrom) {
            var content = readJsonFile(file, extendedFrom);
            if (content.extends) {
                var baseFile = path.resolve(path.dirname(file), content.extends);
                if (fs.existsSync(baseFile)) {
                    content = _.mergeWith(readJSLintFile(baseFile, file), content, function (baseValue, contentValue) {
                        if (_.isArray(baseValue)) {
                            return baseValue.concat(contentValue);
                        }
                    });
                }
                else {
                    that.connection.window.showErrorMessage("Can't find JSLint file " + baseFile + " extended from " + file);
                }
                delete content.extends;
            }
            return content;
        }
        function isWindows() {
            return process.platform === 'win32';
        }
        function getUserHome() {
            return process.env[isWindows() ? 'USERPROFILE' : 'HOME'];
        }
        if (this.configPath && fs.existsSync(this.configPath)) {
            return readJsonFile(this.configPath);
        }
        var jslintOptions = this.jslintOptions;
        // backward compatibility
        if (jslintOptions && jslintOptions.config && fs.existsSync(jslintOptions.config)) {
            return readJsonFile(jslintOptions.config);
        }
        if (fsPath) {
            var packageFile = locateFile(fsPath, 'package.json');
            if (packageFile) {
                var content = readJsonFile(packageFile);
                if (content.jslintConfig) {
                    return content.jslintConfig;
                }
            }
            var configFile = locateFile(fsPath, JSLINTRC);
            if (configFile) {
                return readJSLintFile(configFile);
            }
        }
        var home = getUserHome();
        if (home) {
            var file = path.join(home, JSLINTRC);
            if (fs.existsSync(file)) {
                return readJSLintFile(file);
            }
        }
        return jslintOptions;
    };
    return OptionsResolver;
}());
var JSLINTIGNORE = '.jslintignore';
var FileMatcher = (function () {
    function FileMatcher() {
        this.configPath = null;
        this.defaultExcludePatterns = null;
        this.excludeCache = {};
    }
    FileMatcher.prototype.pickTrueKeys = function (obj) {
        return _.keys(_.pickBy(obj, function (value) {
            return value === true;
        }));
    };
    FileMatcher.prototype.configure = function (path, exclude) {
        this.configPath = path;
        this.excludeCache = {};
        this.defaultExcludePatterns = this.pickTrueKeys(exclude);
    };
    FileMatcher.prototype.clear = function (exclude) {
        this.excludeCache = {};
    };
    FileMatcher.prototype.relativeTo = function (fsPath, folder) {
        if (folder && 0 === fsPath.indexOf(folder)) {
            var cuttingPoint = folder.length;
            if (cuttingPoint < fsPath.length && '/' === fsPath.charAt(cuttingPoint)) {
                cuttingPoint += 1;
            }
            return fsPath.substr(cuttingPoint);
        }
        return fsPath;
    };
    FileMatcher.prototype.folderOf = function (fsPath) {
        var index = fsPath.lastIndexOf('/');
        return index > -1 ? fsPath.substr(0, index) : fsPath;
    };
    FileMatcher.prototype.match = function (excludePatters, path, root) {
        var relativePath = this.relativeTo(path, root);
        return _.some(excludePatters, function (pattern) {
            return minimatch(relativePath, pattern);
        });
    };
    ;
    FileMatcher.prototype.excludes = function (fsPath, root) {
        if (fsPath) {
            if (this.excludeCache.hasOwnProperty(fsPath)) {
                return this.excludeCache[fsPath];
            }
            var shouldBeExcluded = false;
            if (this.configPath && fs.existsSync(this.configPath)) {
                shouldBeExcluded = this.match(processIgnoreFile(this.configPath), fsPath, root);
            }
            else {
                var ignoreFile = locateFile(fsPath, JSLINTIGNORE);
                if (ignoreFile) {
                    shouldBeExcluded = this.match(processIgnoreFile(ignoreFile), fsPath, this.folderOf(ignoreFile));
                }
                else {
                    shouldBeExcluded = this.match(this.defaultExcludePatterns, fsPath, root);
                }
            }
            this.excludeCache[fsPath] = shouldBeExcluded;
            return shouldBeExcluded;
        }
        return true;
    };
    return FileMatcher;
}());
var Linter = (function () {
    function Linter() {
        var _this = this;
        this.connection = vscode_languageserver_1.createConnection(new vscode_languageserver_1.IPCMessageReader(process), new vscode_languageserver_1.IPCMessageWriter(process));
        this.options = new OptionsResolver(this.connection);
        this.fileMatcher = new FileMatcher();
        this.documents = new vscode_languageserver_1.TextDocuments();
        this.documents.onDidChangeContent(function (event) { return _this.validateSingle(event.document); });
        this.documents.listen(this.connection);
        this.connection.onInitialize(function (params) { return _this.onInitialize(params); });
        this.connection.onDidChangeConfiguration(function (params) {
            var jslintSettings = _.assign({ options: {}, exclude: {} }, params.settings.jslint);
            _this.options.configure(jslintSettings.config, jslintSettings.options);
            _this.fileMatcher.configure(jslintSettings.excludePath, jslintSettings.exclude);
            _this.options.setVersion(jslintSettings.version);
            _this.validateAll();
        });
        this.connection.onDidChangeWatchedFiles(function (params) {
            var needsValidating = false;
            if (params.changes) {
                params.changes.forEach(function (change) {
                    switch (_this.lastSegment(change.uri)) {
                        case JSLINTRC:
                            _this.options.clear();
                            needsValidating = true;
                            break;
                        case JSLINTIGNORE:
                            _this.fileMatcher.clear();
                            needsValidating = true;
                            break;
                    }
                });
            }
            if (needsValidating) {
                _this.validateAll();
            }
        });
    }
    Linter.prototype.listen = function () {
        this.connection.listen();
    };
    Linter.prototype.lastSegment = function (fsPath) {
        var index = fsPath.lastIndexOf('/');
        return index > -1 ? fsPath.substr(index + 1) : fsPath;
    };
    Linter.prototype.onInitialize = function (params) {
        var _this = this;
        this.workspaceRoot = params.rootPath;
        return vscode_languageserver_1.Files.resolveModule(this.workspaceRoot, 'jslint').then(function (value) {
            console.log(value);
            if (!value.load) {
                return new vscode_languageserver_1.ResponseError(99, 'The JSLint library doesn\'t export a load property.', { retry: false });
            }
            _this.lib = value;
            var result = { capabilities: { textDocumentSync: _this.documents.syncKind } };
            return result;
        }, function (error) {
            return Promise.reject(new vscode_languageserver_1.ResponseError(99, 'Failed to load JSLint library. Please install JSLint in your workspace folder using \'npm install jslint\' or globally using \'npm install -g jslint\' and then press Retry.', { retry: true }));
        });
    };
    Linter.prototype.validateAll = function () {
        var _this = this;
        var tracker = new vscode_languageserver_1.ErrorMessageTracker();
        this.documents.all().forEach(function (document) {
            try {
                _this.validate(document);
            }
            catch (err) {
                tracker.add(_this.getMessage(err, document));
            }
        });
        tracker.sendErrors(this.connection);
    };
    Linter.prototype.validateSingle = function (document) {
        try {
            this.validate(document);
        }
        catch (err) {
            this.connection.window.showErrorMessage(this.getMessage(err, document));
        }
    };
    Linter.prototype.lintContent = function (content, fsPath) {
        var JSLINT = this.lib.load(this.options.getVersion() || 'latest');
        var options = this.options.getOptions(fsPath) || {};
        JSLINT(content, options, options.globals || {});
        var output;
        try {
            output = JSLINT.data();
        }
        catch (err) {
            this.connection.window.showErrorMessage('JSLint library does not export a data() method.  The JSLint version you are using is probably out of date.');
        }
        var isLegacy = Array.isArray(output.errors);
        var fudge = isLegacy ? 0 : 1; // old jslint versions use 1-based lines/columns, modern versions use 0-based
        var warnings = isLegacy ? output.errors.filter(Boolean) : output.warnings;
        return warnings.map(function (warning, i) {
            return {
                code: warning.code,
                id: i,
                line: warning.line + fudge,
                character: (isLegacy ? warning.character : warning.column) + fudge,
                reason: (isLegacy ? warning.reason : warning.message)
            };
        });
    };
    Linter.prototype.validate = function (document) {
        var fsPath = vscode_languageserver_1.Files.uriToFilePath(document.uri);
        if (!fsPath) {
            fsPath = this.workspaceRoot;
        }
        var diagnostics = [];
        if (!this.fileMatcher.excludes(fsPath, this.workspaceRoot)) {
            var errors = this.lintContent(document.getText(), fsPath);
            if (errors) {
                errors.forEach(function (error) {
                    // For some reason the errors array contains null.
                    if (error) {
                        diagnostics.push(makeDiagnostic(error));
                    }
                });
            }
        }
        this.connection.sendDiagnostics({ uri: document.uri, diagnostics: diagnostics });
    };
    Linter.prototype.getMessage = function (err, document) {
        var result = null;
        if (typeof err.message === 'string' || err.message instanceof String) {
            result = err.message;
        }
        else {
            result = "An unknown error occured while validating file: " + vscode_languageserver_1.Files.uriToFilePath(document.uri);
        }
        return result;
    };
    return Linter;
}());
new Linter().listen();
//# sourceMappingURL=server.js.map