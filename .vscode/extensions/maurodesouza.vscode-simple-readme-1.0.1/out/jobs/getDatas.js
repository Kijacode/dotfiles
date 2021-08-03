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
const vscode_1 = require("vscode");
const getProjectName_1 = require("./getProjectName");
const toTitleCase_1 = require("../utils/toTitleCase");
const toKebabLowercase_1 = require("../utils/toKebabLowercase");
const toContinuosLowerCase_1 = require("../utils/toContinuosLowerCase");
exports.default = (uri) => __awaiter(void 0, void 0, void 0, function* () {
    const projectname = yield getProjectName_1.default(uri);
    const readmeConfig = vscode_1.workspace.getConfiguration('simple.readme.settings');
    const app_name = toTitleCase_1.default(projectname);
    const repository = toKebabLowercase_1.default(app_name);
    const app_url = toContinuosLowerCase_1.default(app_name);
    const github = readmeConfig.get('github') || '{{YOUR_GITHUB_USERNAME}}';
    const author = readmeConfig.get('name') || '{{YOUR_NAME}}';
    return {
        datas: {
            app_name,
            repository,
            app_url,
            github,
            author,
        },
        lang: readmeConfig.get('lang') || 'en'
    };
});
//# sourceMappingURL=getDatas.js.map