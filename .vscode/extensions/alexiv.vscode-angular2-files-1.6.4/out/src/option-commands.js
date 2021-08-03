"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionsCommands = void 0;
const option_type_1 = require("./enums/option-type");
exports.optionsCommands = new Map([
    [option_type_1.OptionType.InlineStyle, { commands: ['--inline-style', '-s'], type: 'True | False', configPath: 'defaults.{resource}.inlineStyle', description: 'Specifies if the style will be in the ts file.' }],
    [option_type_1.OptionType.InlineTemplate, { commands: ['--inline-template', '-t'], type: 'True | False', configPath: 'defaults.{resource}.inlineTemplate', description: 'Specifies if the template will be in the ts file.' }],
    [option_type_1.OptionType.ViewEncapsulation, { commands: ['--view-encapsulation'], type: 'Emulated | Native | None', configPath: 'defaults.{resource}.viewEncapsulation', description: 'Specifies the view encapsulation strategy.' }],
    [option_type_1.OptionType.ChangeDetection, { commands: ['--change-detection', '-c'], type: 'Default | OnPush', configPath: 'defaults.{resource}.changeDetection', description: 'Specifies the change detection strategy.' }],
    [option_type_1.OptionType.Prefix, { commands: ['--prefix', '-p'], configPath: 'defaults.{resource}.prefix', description: 'The prefix to apply to generated selectors.' }],
    [option_type_1.OptionType.Styleext, { commands: ['--styleext'], configPath: 'defaults.{resource}.styleext', description: 'The file extension to be used for style files.' }],
    [option_type_1.OptionType.Spec, { commands: ['--spec'], type: 'True | False', configPath: 'defaults.{resource}.spec', description: 'Specifies if a spec file is generated.' }],
    [option_type_1.OptionType.Flat, { commands: ['--flat'], type: 'True | False', configPath: 'defaults.{resource}.flat', description: 'Flag to indicate if a dir is created.' }],
    [option_type_1.OptionType.SkipImport, { commands: ['--skip-import'], configPath: 'defaults.{resource}.skipImport', type: 'True | False', description: 'Flag to skip the module import' }],
    [option_type_1.OptionType.Selector, { commands: ['--selector'], configPath: 'defaults.{resource}.selector', description: 'The selector to use for the component.' }],
    [option_type_1.OptionType.Module, { commands: ['--module', '-m'], configPath: 'defaults.{resource}.module', description: 'Allows specification of the declaring module.' }],
    [option_type_1.OptionType.Export, { commands: ['--export'], configPath: 'defaults.{resource}.export', type: 'True | False', description: 'Specifies if declaring module exports the component.' }],
    [option_type_1.OptionType.Routing, { commands: ['--routing'], configPath: 'defaults.{resource}.routing', type: 'True | False', description: 'Generates a routing module.' }],
    [option_type_1.OptionType.RoutingScope, { commands: ['--routing-scope'], configPath: 'defaults.{resource}.routingScope', type: 'Child | Root', description: 'The scope for the generated routing.' }],
    [option_type_1.OptionType.CommonModule, { commands: ['--common-module'], configPath: 'defaults.{resource}.commonModule', type: 'True | False', description: 'Flag to control whether the CommonModule is imported.' }],
    [option_type_1.OptionType.ShowOptions, { commands: ['-o'], description: 'Allow to override options' }],
]);
//# sourceMappingURL=option-commands.js.map