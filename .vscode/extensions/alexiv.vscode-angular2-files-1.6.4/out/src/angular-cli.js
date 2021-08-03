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
exports.AngularCli = void 0;
const fs = require("fs");
const path = require("path");
const file_contents_1 = require("./file-contents");
const formatting_1 = require("./formatting");
const ioutil_1 = require("./ioutil");
const ng_module_utils_1 = require("./ng-module-utils");
const promisify_1 = require("./promisify");
const resources_1 = require("./resources");
const fsWriteFile = promisify_1.promisify(fs.writeFile);
const fsReaddir = promisify_1.promisify(fs.readdir);
const fsStat = promisify_1.promisify(fs.stat);
const fsReadFile = promisify_1.promisify(fs.readFile);
class AngularCli {
    constructor(fc = new file_contents_1.FileContents()) {
        this.fc = fc;
        fc.loadTemplates();
    }
    findModulePathRecursive(dir, fileList, optionalFilterFunction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fileList) {
                console.error('Variable \'fileList\' is undefined or NULL.');
                return;
            }
            const files = yield fsReaddir(dir);
            for (const i in files) {
                if (!files.hasOwnProperty(i)) {
                    continue;
                }
                const name = path.join(dir, files[i]);
                const stat = yield fsStat(name);
                if (stat.isDirectory()) {
                    yield this.findModulePathRecursive(name, fileList, optionalFilterFunction);
                }
                else {
                    if (optionalFilterFunction && optionalFilterFunction(name) !== true) {
                        continue;
                    }
                    fileList.push(name);
                }
            }
        });
    }
    addToImport(data, fileName, type, relativePath) {
        const typeUpper = formatting_1.toUpperCase(type);
        const fileNameUpper = formatting_1.toUpperCase(fileName);
        return ng_module_utils_1.addToImport(data, `import { ${fileNameUpper}${typeUpper} } from '${relativePath}/${fileName}.${type}';`);
    }
    addToArray(content, fileName, type, prop) {
        const item = `${formatting_1.toUpperCase(fileName)}${formatting_1.toUpperCase(type)}`;
        return ng_module_utils_1.addToType(content, prop, item);
    }
    getRelativePath(dst, src) {
        const modulePath = path.parse(dst).dir;
        return '.' + src.replace(modulePath, '').replace(/\\/g, '/');
    }
    addDeclarationsToModule(loc, type, module, exports = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const condition = (name) => module ? name.includes(`${module}.module.ts`) : name.includes('.module.ts');
            const moduleFiles = [];
            yield this.findModulePathRecursive(loc.rootPath, moduleFiles, condition);
            // at least one module is there
            if (moduleFiles.length > 0) {
                moduleFiles.sort((a, b) => path.dirname(a).length - path.dirname(b).length);
                // find closest module      
                let [module] = moduleFiles;
                let minDistance = Infinity;
                for (const moduleFile of moduleFiles) {
                    const moduleDirPath = path.parse(moduleFile).dir;
                    const locPath = loc.dirPath.replace(loc.dirName, '');
                    const distance = Math.abs(locPath.length - moduleDirPath.length);
                    if (distance < minDistance) {
                        minDistance = distance;
                        module = moduleFile;
                    }
                }
                const data = yield fsReadFile(module, 'utf8');
                // relativePath
                const relativePath = this.getRelativePath(module, loc.dirPath);
                let content = this.addToImport(data, loc.fileName, type, relativePath);
                content = this.addToArray(content, loc.fileName, type, 'declarations');
                if (exports) {
                    content = this.addToArray(content, loc.fileName, type, 'exports');
                }
                yield fsWriteFile(module, content);
            }
        });
    }
    generateResources(name, loc, config) {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = resources_1.resources.get(name);
            loc.dirName = resource.hasOwnProperty('locDirName') ? resource.locDirName(loc, config) : loc.dirName;
            loc.dirPath = resource.hasOwnProperty('locDirPath') ? resource.locDirPath(loc, config) : loc.dirPath;
            if (resource.hasOwnProperty('declaration') &&
                resource.declaration &&
                !config.defaults[name].skipImport) {
                yield this.addDeclarationsToModule(loc, resource.declaration, config.defaults[name].module, config.defaults[name].export);
            }
            const files = resource.files.filter(file => (file.condition) ? file.condition(config, loc.params) : true).map((file) => {
                const fileName = file.name(config);
                return {
                    name: path.join(loc.dirPath, fileName.startsWith('-') ? `${loc.fileName}${fileName}` : `${loc.fileName}.${fileName}`),
                    content: this.fc.getTemplateContent(file.type, config, loc.fileName, loc.params),
                };
            });
            if (resource.hasOwnProperty('createFolder') && resource.createFolder(config)) {
                yield ioutil_1.createFolder(loc);
            }
            yield ioutil_1.createFiles(loc, files);
        });
    }
}
exports.AngularCli = AngularCli;
//# sourceMappingURL=angular-cli.js.map