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
exports.generateReadme = void 0;
const vscode_1 = require("vscode");
const getCurrentUri_1 = require("../jobs/getCurrentUri");
const getReadmeUri_1 = require("../jobs/getReadmeUri");
const getDatas_1 = require("../jobs/getDatas");
const getContent_1 = require("../jobs/getContent");
const generateReadme = (uri) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentUri = yield getCurrentUri_1.default(uri);
        const readmeUri = yield getReadmeUri_1.default(currentUri);
        const datas = yield getDatas_1.default(currentUri);
        const content = yield getContent_1.default(datas);
        yield vscode_1.workspace.fs.writeFile(readmeUri, Buffer.from(content));
    }
    catch (err) {
        vscode_1.window.showErrorMessage(err.message);
    }
    ;
});
exports.generateReadme = generateReadme;
//# sourceMappingURL=generateReadme.js.map