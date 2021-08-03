'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    let disposablenewangular = vscode.commands.registerCommand('extension.newAngular', () => {
        var newcommand = "ng new ";
        var path;
        let options = {
            prompt: "Insert app name",
            placeHolder: "Name"
        };
        vscode.window.showInputBox(options).then(value => {
            if (!value)
                return;
            path = value;
            newcommand += (value + " ");
            let options = {
                prompt: "--directory (-dir), --dry-run (-d), --inline-style (-is), --inline-template (-it), --minimal, --prefix (-p), --routing, --skip-commit (-sc), --skip-git (-sg), --skip-install (-si), --skip-tests (-st), --source-dir (-sd), --style, --verbose (-v)",
                placeHolder: "Insert options (optional)"
            };
            vscode.window.showInputBox(options).then(value => {
                newcommand += (value + " ");
                var terminal = vscode.window.createTerminal("angularnew");
                terminal.show();
                terminal.sendText(newcommand);
                terminal.sendText("cd " + path);
                terminal.sendText("exit");
            });
        });
        context.subscriptions.push(disposablenewangular);
    });
    var clicommanditems;
    var clioptions;
    clicommanditems = ["class",
        "component",
        "directive",
        "enum",
        "guard",
        "interface",
        "module",
        "pipe",
        "service"];
    var answer1, answer2, answer3;
    let disposablegenerateangular = vscode.commands.registerCommand('extension.generateAngular', () => {
        vscode.window.showQuickPick(clicommanditems).then(value => {
            if (!value)
                return;
            answer1 = value;
            let options = {
                prompt: "Insert " + answer1 + " name",
                placeHolder: "Name"
            };
            vscode.window.showInputBox(options).then(value => {
                if (!value)
                    return;
                answer2 = value;
                clioptions = "";
                switch (answer1) {
                    case clicommanditems[0]: {
                        clioptions = "--app (-a), --spec";
                        break;
                    }
                    case clicommanditems[1]: {
                        clioptions = "--app (-a), --change-detection (-cd), --flat, --export, --inline-style (-is), --inline-template (-it), --module (-m), --prefix, --skip-import, --spec, --view-encapsulation (-ve)";
                        break;
                    }
                    case clicommanditems[2]: {
                        clioptions = "--app (-a), --flat, --export, --module (-m), --prefix, --skip-import, --spec";
                        break;
                    }
                    case clicommanditems[3]: {
                        clioptions = "--app (-a)";
                        break;
                    }
                    case clicommanditems[4]: {
                        clioptions = "--app (-a), --flat, --module (-m), --spec";
                        break;
                    }
                    case clicommanditems[5]: {
                        clioptions = "--app (-a), --type";
                        break;
                    }
                    case clicommanditems[6]: {
                        clioptions = "--app (-a), --flat, --module (-m), --spec, --routing";
                        break;
                    }
                    case clicommanditems[7]: {
                        clioptions = "--app (-a), --flat, --export, --module (-m), --skip-import, --spec";
                        break;
                    }
                    case clicommanditems[8]: {
                        clioptions = "--app (-a), --flat, --module (-m), --spec";
                        break;
                    }
                }
                let options = {
                    prompt: clioptions,
                    placeHolder: "Insert options (optional)"
                };
                vscode.window.showInputBox(options).then(value => {
                    answer3 = value;
                    var genCommand = "ng generate " + answer1 + " " + answer2 + " " + answer3;
                    var terminal = vscode.window.createTerminal("angulargenerator");
                    terminal.show();
                    terminal.sendText(genCommand);
                    terminal.sendText("exit");
                });
            });
        });
    });
    context.subscriptions.push(disposablegenerateangular);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map