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
const path = require("path");
const Mustache = require("mustache");
exports.default = ({ datas, lang }) => __awaiter(void 0, void 0, void 0, function* () {
    const templatePath = path.resolve(__dirname, '..', '..', 'templates', `${lang}`, 'default.md');
    const templateUri = vscode_1.Uri.file(templatePath);
    const buffer = yield vscode_1.workspace.fs.readFile(templateUri);
    const content = Mustache.render(buffer.toString(), datas);
    return content;
});
//# sourceMappingURL=getContent.js.map