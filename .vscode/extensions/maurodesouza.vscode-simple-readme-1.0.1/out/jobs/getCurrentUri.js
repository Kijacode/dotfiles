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
exports.default = (uri) => __awaiter(void 0, void 0, void 0, function* () {
    const rootFolderUri = vscode_1.workspace.workspaceFolders && vscode_1.workspace.workspaceFolders[0].uri;
    const currentUri = uri || rootFolderUri;
    if (currentUri) {
        return currentUri;
    }
    throw new Error("Workspace doesn't contain any folders.");
});
//# sourceMappingURL=getCurrentUri.js.map