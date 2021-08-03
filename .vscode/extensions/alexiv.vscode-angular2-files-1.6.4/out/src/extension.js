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
exports.activate = void 0;
const vscode_1 = require("vscode");
const configuration_manager_1 = require("./configuration-manager");
const editor_1 = require("./editor");
const commands_1 = require("./commands");
const formatting_1 = require("./formatting");
const angular_cli_1 = require("./angular-cli");
const option_type_1 = require("./enums/option-type");
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const angularCli = new angular_cli_1.AngularCli();
        const cm = new configuration_manager_1.ConfigurationManager();
        let config = null;
        setImmediate(() => __awaiter(this, void 0, void 0, function* () { return config = yield cm.getConfig(); }));
        // watch and update on config file changes
        cm.watchConfigFiles(() => __awaiter(this, void 0, void 0, function* () { return config = yield cm.getConfig(); }));
        const showDynamicDialog = (args, fileName, resource) => __awaiter(this, void 0, void 0, function* () {
            const loc = yield editor_1.showFileNameDialog(args, resource, fileName);
            let resourceConfig = config;
            if (loc.params.includes(option_type_1.OptionType.ShowOptions)) {
                const selectedOptions = yield editor_1.showOptionsDialog(config, loc, resource);
                if (selectedOptions) {
                    const optionsValuesMap = yield editor_1.configureOptionsValues(config, loc, resource, selectedOptions);
                    loc.params = [...new Set([...loc.params, ...optionsValuesMap.keys()])];
                    resourceConfig = editor_1.mapConfigValues(config, resource, optionsValuesMap);
                }
            }
            else {
                if (loc.paramsMap.size > 0) {
                    resourceConfig = editor_1.mapConfigValues(config, resource, loc.paramsMap);
                }
            }
            yield angularCli.generateResources(resource, loc, resourceConfig);
            editor_1.displayStatusMessage(formatting_1.toTileCase(resource), loc.fileName);
        });
        for (const [key, value] of commands_1.commandsMap) {
            const command = vscode_1.commands.registerCommand(key, args => showDynamicDialog(args, value.fileName, value.resource));
            context.subscriptions.push(command);
        }
    });
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map