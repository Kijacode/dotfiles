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
exports.FileContents = void 0;
const fs = require("fs");
const path = require("path");
const es6Renderer = require("express-es6-template-engine");
const formatting_1 = require("./formatting");
const promisify_1 = require("./promisify");
const fsReaddir = promisify_1.promisify(fs.readdir);
const fsReadFile = promisify_1.promisify(fs.readFile);
const TEMPLATES_FOLDER = 'templates';
const TEMPLATE_ARGUMENTS = 'inputName, upperName, interfacePrefix, cmpPrefix, dirPrefix, cmpSelector, dirSelector, componentViewEncapsulation, componentChangeDetection, componentInlineTemplate, componentInlineStyle, defaultsStyleExt, routingScope, importCommonModule, params';
class FileContents {
    constructor() {
        this.templatesMap = new Map();
    }
    loadTemplates() {
        return __awaiter(this, void 0, void 0, function* () {
            const map = new Map();
            const templatesMap = yield this.getTemplates();
            for (const [key, value] of templatesMap.entries()) {
                const compiled = es6Renderer(value, TEMPLATE_ARGUMENTS);
                this.templatesMap.set(key, compiled);
            }
        });
    }
    getTemplates() {
        return __awaiter(this, void 0, void 0, function* () {
            const templatesPath = path.join(__dirname, TEMPLATES_FOLDER);
            const templatesFiles = yield fsReaddir(templatesPath, 'utf-8');
            const templatesFilesPromises = templatesFiles.map(t => fsReadFile(path.join(__dirname, TEMPLATES_FOLDER, t), 'utf8').then(data => [t, data]));
            const templates = yield Promise.all(templatesFilesPromises);
            return new Map(templates.map(x => x));
        });
    }
    getTemplateContent(template, config, inputName, params = []) {
        const templateName = template;
        const [app] = config.apps;
        const cmpPrefix = config.defaults.component.prefix || app.prefix;
        const dirPrefix = config.defaults.directive.prefix || app.prefix;
        const cmpSelector = config.defaults.component.selector || `${cmpPrefix}-${inputName}`;
        const dirSelector = config.defaults.directive.selector || `${dirPrefix}${formatting_1.toUpperCase(inputName)}`;
        const styleExt = config.defaults.component.styleext || config.defaults.styleExt;
        const routingScope = config.defaults.module.routingScope || 'Child';
        const importCommonModule = config.defaults.module.commonModule;
        const args = [inputName,
            formatting_1.toUpperCase(inputName),
            config.defaults.interface.prefix,
            cmpPrefix,
            dirPrefix,
            cmpSelector,
            dirSelector,
            config.defaults.component.viewEncapsulation,
            config.defaults.component.changeDetection,
            config.defaults.component.inlineTemplate,
            config.defaults.component.inlineStyle,
            styleExt,
            routingScope,
            importCommonModule,
            params];
        return (this.templatesMap.has(templateName)) ? this.templatesMap.get(templateName)(...args) : '';
    }
}
exports.FileContents = FileContents;
//# sourceMappingURL=file-contents.js.map