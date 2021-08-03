"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class VscodeUtil {
    // token or gist input
    static getInputBox(boxTag) {
        if (!boxTag || boxTag == "") {
            boxTag = "Enter Something";
        }
        let options = {
            placeHolder: boxTag,
            password: false,
            prompt: "Link is opened to get the github token."
        };
        return options;
    }
    ;
    static getPreviewTypeQuickPick() {
        return __awaiter(this, void 0, void 0, function* () {
            let items = [
                {
                    label: "image",
                    description: "Preview Image"
                }, {
                    label: "css",
                    description: "Preview CSS"
                }, {
                    label: "mermaid",
                    description: "Preview Mermaid"
                }, {
                    label: "markdown",
                    description: "Preview Markdown"
                }, {
                    label: "rst",
                    description: "Preview ReStructuredText"
                }, {
                    label: "html",
                    description: "Preview HTML and Jade"
                }
            ];
            //Ask what they want to do:
            let choice = yield vscode.window.showQuickPick(items, {
                matchOnDescription: true,
                placeHolder: "Couldn't determine type to preivew, please choose."
            });
            if (!choice || !choice.label) {
                throw new Error("no preview type selected");
            }
            return choice.label.toLowerCase();
        });
    }
    static getPreviewType(editor, dontAsk = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!editor) {
                editor = vscode.window.activeTextEditor;
            }
            if (!editor || !editor.document) {
                return Promise.resolve("none");
            }
            switch (editor.document.languageId) {
                case "html":
                case "jade":
                case "markdown":
                case "css":
                case "mermaid":
                case "rst":
                    return Promise.resolve(editor.document.languageId);
                default:
                    break;
            }
            if (dontAsk) {
                return Promise.resolve(editor.document.languageId);
                // throw new Error("Couldn't determine type to preivew, and the extenion don't let show choose box.");
            }
            //Ask what they want to do:
            return Promise.resolve(VscodeUtil.getPreviewTypeQuickPick());
        });
    }
    ;
}
exports.VscodeUtil = VscodeUtil;
//# sourceMappingURL=vscodeUtil.js.map