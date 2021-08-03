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
exports.showWarning = exports.mapConfigValues = exports.configureOptionsValues = exports.showOptionsDialog = exports.showFileNameDialog = exports.openFileInEditor = exports.displayStatusMessage = void 0;
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const option_type_1 = require("./enums/option-type");
const resources_1 = require("./resources");
const option_commands_1 = require("./option-commands");
const dJSON = require("dirty-json");
exports.displayStatusMessage = (type, name, timeout = 2000) => vscode.window.setStatusBarMessage(`${type} ${name} was successfully generated`, timeout);
exports.openFileInEditor = (folderName) => __awaiter(void 0, void 0, void 0, function* () {
    const inputName = path.parse(folderName).name;
    const fullFilePath = path.join(folderName, `${inputName}.component.ts`);
    const textDocument = yield vscode.workspace.openTextDocument(fullFilePath);
    return yield vscode.window.showTextDocument(textDocument);
});
// Show input prompt for folder name 
exports.showFileNameDialog = (args, type, defaultTypeName) => __awaiter(void 0, void 0, void 0, function* () {
    let clickedFolderPath;
    if (args) {
        clickedFolderPath = args.fsPath;
    }
    else {
        if (!vscode.window.activeTextEditor) {
            throw new Error('Please open a file first.. or just right-click on a file/folder and use the context menu!');
        }
        else {
            clickedFolderPath = path.dirname(vscode.window.activeTextEditor.document.fileName);
        }
    }
    const rootPath = fs.lstatSync(clickedFolderPath).isDirectory() ? clickedFolderPath : path.dirname(clickedFolderPath);
    if (vscode.workspace.rootPath === undefined) {
        throw new Error('Please open a project first. Thanks! :-)');
    }
    else {
        let fileName = yield vscode.window.showInputBox({ prompt: `Type the name of the new ${type}`, value: `${defaultTypeName}` });
        if (!fileName) {
            throw new Error('That\'s not a valid name! (no whitespaces or special characters)');
        }
        else {
            let dirName = '';
            const [showOptionsCmd] = option_commands_1.optionsCommands.get(option_type_1.OptionType.ShowOptions).commands;
            const resoureParamsMap = resources_1.resources.get(type).options ? resources_1.resources.get(type).options.map(op => option_commands_1.optionsCommands.get(op).commands.map(v => [v, op])) : [];
            const optionsMap = new Map(Array.prototype.concat.apply([], [...resoureParamsMap, [[showOptionsCmd, option_type_1.OptionType.ShowOptions]]]));
            const resourceOptionsTags = resources_1.resources.get(type).options ? Array.prototype.concat.apply([], resources_1.resources.get(type).options.map(op => option_commands_1.optionsCommands.get(op).commands)) : [];
            const separators = ['--', ' -'];
            const optionValuesSparator = ['=', ' '];
            const filenameTokens = fileName.split(' ');
            const optionsString = filenameTokens.slice(1, filenameTokens.length).join(' ');
            [fileName] = filenameTokens;
            const optionsTokens = optionsString.split(new RegExp(separators.join('|'), 'g'))
                .filter(item => item.trim() !== '')
                .map(item => item.trim())
                .map(item => (item.length === 2) ? item : '-' + item);
            const params = optionsTokens
                .filter((t) => {
                const [option] = t.split(new RegExp(optionValuesSparator.join('|'), 'g'));
                return resourceOptionsTags.includes(option) || option === showOptionsCmd;
            })
                .map((t) => {
                const [key, value = 'True'] = t.split(new RegExp(optionValuesSparator.join('|'), 'g'));
                return [optionsMap.get(key), value];
            });
            const paramsMap = new Map(params);
            const fullPath = path.join(rootPath, fileName);
            if (fileName.indexOf('\\') !== -1) {
                [dirName, fileName] = fileName.split('\\');
            }
            const dirPath = path.join(rootPath, dirName);
            return {
                fullPath,
                fileName,
                dirName,
                dirPath,
                rootPath,
                paramsMap,
                params: [...paramsMap.keys()],
            };
        }
    }
});
const deepValue = (obj, path) => {
    const parts = path.split('.');
    let rv;
    let index;
    // tslint:disable-next-line:no-increment-decrement
    for (rv = obj, index = 0; rv && index < parts.length; ++index) {
        rv = rv[parts[index]];
    }
    return rv;
};
exports.showOptionsDialog = (config, loc, resource) => __awaiter(void 0, void 0, void 0, function* () {
    const resourceOptions = resources_1.resources.get(resource).options;
    if (!resourceOptions) {
        return null;
    }
    const optionMap = new Map(resourceOptions.map((op) => {
        const optionItem = option_commands_1.optionsCommands.get(op);
        const [optionCommand] = optionItem.commands;
        const optionName = optionCommand.replace('--', '');
        return [optionName, op];
    }));
    const resourceOptionsChoices = [...optionMap.entries()].map((option) => {
        const [optionName, optionType] = option;
        const optionItem = option_commands_1.optionsCommands.get(optionType);
        const resourceConfigPath = optionItem.configPath ? optionItem.configPath.replace('{resource}', resource.toLocaleLowerCase()) : '';
        const optionConfiguredDefaultValue = (optionItem.configPath) ? deepValue(config, resourceConfigPath) || '' : '';
        const selectedValue = loc.paramsMap.has(optionType) ? loc.paramsMap.get(optionType) : '';
        const optionDefaultValue = selectedValue || optionConfiguredDefaultValue;
        const displayValue = (optionDefaultValue && optionDefaultValue !== '') ? `${optionName} (default: ${optionDefaultValue})` : optionName;
        return { label: displayValue, description: optionItem.description, picked: loc.params.includes(optionType) };
    });
    const selectedOptions = yield vscode.window.showQuickPick(resourceOptionsChoices, { canPickMany: true, placeHolder: `Select ${resource} options to override` });
    const selectedOptionTypes = selectedOptions.map(o => o.label.split(' ')[0].trim())
        .map(l => optionMap.get(l));
    return selectedOptionTypes;
});
const asyncForEach = (array, callback) => __awaiter(void 0, void 0, void 0, function* () {
    // tslint:disable-next-line:no-increment-decrement
    for (let index = 0; index < array.length; index++) {
        yield callback(array[index], index, array);
    }
});
exports.configureOptionsValues = (config, loc, resource, optionTypes) => __awaiter(void 0, void 0, void 0, function* () {
    const optionsValuesMap = new Map();
    yield asyncForEach(optionTypes, (ot) => __awaiter(void 0, void 0, void 0, function* () {
        const optionItem = option_commands_1.optionsCommands.get(ot);
        const resourceConfigPath = optionItem.configPath ? optionItem.configPath.replace('{resource}', resource.toLocaleLowerCase()) : '';
        const optionDefaultValue = (optionItem.configPath) ? deepValue(config, resourceConfigPath) || '' : '';
        const [command] = optionItem.commands;
        const items = optionItem.type ? optionItem.type.split('|').map(item => item.trim()) : [];
        const [firstItem = ''] = items;
        const sortedItems = firstItem.toLowerCase() === optionDefaultValue.toString().toLowerCase() ? items.reverse() : items;
        const selectedValue = loc.paramsMap.has(ot) ? loc.paramsMap.get(ot) : '';
        const params = { placeHolder: `${command}: ${optionItem.description}`, value: selectedValue };
        const val = (optionItem.type) ? yield vscode.window.showQuickPick(sortedItems, params) : yield vscode.window.showInputBox(params);
        optionsValuesMap.set(ot, val);
    }));
    return optionsValuesMap;
});
const setToValue = (obj, value, path) => {
    let i;
    let localObj = obj;
    const localPath = path.split('.');
    // tslint:disable-next-line:no-increment-decrement
    for (i = 0; i < localPath.length - 1; i++) {
        localObj = localObj[localPath[i]];
    }
    localObj[localPath[i]] = value;
};
const parseOptionValue = value => ['True', 'False'].includes(value) ? dJSON.parse(value.toLocaleLowerCase()) : value;
exports.mapConfigValues = (config, resource, optionsValuesMap) => {
    const newConfig = dJSON.parse(JSON.stringify(config));
    optionsValuesMap.forEach((val, key) => {
        const optionItem = option_commands_1.optionsCommands.get(key);
        const optionValue = parseOptionValue(val);
        const resourceConfigPath = optionItem.configPath ? optionItem.configPath.replace('{resource}', resource.toLocaleLowerCase()) : '';
        setToValue(newConfig, optionValue, resourceConfigPath);
    });
    return newConfig;
};
exports.showWarning = () => __awaiter(void 0, void 0, void 0, function* () {
    vscode.window.showInformationMessage('Please install latest version of vscode', 'Got It');
});
//# sourceMappingURL=editor.js.map