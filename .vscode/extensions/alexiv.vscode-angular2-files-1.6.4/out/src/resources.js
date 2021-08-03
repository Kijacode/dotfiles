"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resources = void 0;
const path = require("path");
const template_type_1 = require("./enums/template-type");
const resource_type_1 = require("./enums/resource-type");
const option_type_1 = require("./enums/option-type");
exports.resources = new Map([
    [resource_type_1.ResourceType.Module, {
            locDirName: (loc, config) => (!config.defaults.module.flat) ? loc.fileName : loc.dirName,
            locDirPath: (loc, config) => path.join(loc.dirPath, loc.dirName),
            files: [{ name: config => `component.${config.defaults.component.styleext || config.defaults.styleExt}`, type: template_type_1.TemplateType.ComponentStyle },
                { name: config => `component.html`, type: template_type_1.TemplateType.ComponentHtml },
                { name: config => `component.ts`, type: template_type_1.TemplateType.Component },
                { name: config => `module.ts`, type: template_type_1.TemplateType.Module },
                { name: config => `-routing.module.ts`, type: template_type_1.TemplateType.ModuleRouting, condition: (config, params) => config.defaults.module.routing },
                { name: config => `component.spec.ts`, type: template_type_1.TemplateType.ConponentSpec, condition: (config, params) => config.defaults.module.spec }],
            createFolder: config => !config.defaults.module.flat,
            options: [option_type_1.OptionType.Routing,
                option_type_1.OptionType.RoutingScope,
                option_type_1.OptionType.Spec,
                option_type_1.OptionType.Flat,
                option_type_1.OptionType.CommonModule,
                option_type_1.OptionType.Module],
        }],
    [resource_type_1.ResourceType.Enum, { files: [{ name: config => `enum.ts`, type: template_type_1.TemplateType.Enum }] }],
    [resource_type_1.ResourceType.Route, { files: [{ name: config => `routing.ts`, type: template_type_1.TemplateType.Route }] }],
    [resource_type_1.ResourceType.Interface, { files: [{ name: config => `ts`, type: template_type_1.TemplateType.Inteface }] }],
    [resource_type_1.ResourceType.Class, {
            files: [
                { name: config => `ts`, type: template_type_1.TemplateType.Class },
                { name: config => `spec.ts`, type: template_type_1.TemplateType.ClassSpec, condition: (config, params) => config.defaults.class.spec },
            ],
            options: [option_type_1.OptionType.Spec],
        }],
    [resource_type_1.ResourceType.Service, {
            locDirName: (loc, config) => (!config.defaults.service.flat) ? loc.fileName : loc.dirName,
            locDirPath: (loc, config) => path.join(loc.dirPath, loc.dirName),
            files: [
                { name: config => `service.ts`, type: template_type_1.TemplateType.Service, condition: (config, params) => config.version === 'ng5' },
                { name: config => `service.ts`, type: template_type_1.TemplateType.ServiceNg6, condition: (config, params) => config.version === 'ng6' },
                { name: config => `service.spec.ts`, type: template_type_1.TemplateType.ServiceSpec, condition: (config, params) => config.defaults.service.spec },
            ],
            createFolder: config => !config.defaults.service.flat,
            options: [option_type_1.OptionType.Flat,
                option_type_1.OptionType.Spec],
        }],
    [resource_type_1.ResourceType.Pipe, {
            locDirName: (loc, config) => (!config.defaults.pipe.flat) ? loc.fileName : loc.dirName,
            locDirPath: (loc, config) => path.join(loc.dirPath, loc.dirName),
            files: [
                { name: config => `pipe.ts`, type: template_type_1.TemplateType.Pipe },
                { name: config => `pipe.spec.ts`, type: template_type_1.TemplateType.PipeSpec, condition: (config, params) => config.defaults.pipe.spec },
            ],
            createFolder: config => !config.defaults.pipe.flat,
            declaration: 'pipe',
            options: [option_type_1.OptionType.Flat,
                option_type_1.OptionType.Spec,
                option_type_1.OptionType.SkipImport,
                option_type_1.OptionType.Module,
                option_type_1.OptionType.Export],
        }],
    [resource_type_1.ResourceType.Directive, {
            locDirName: (loc, config) => (!config.defaults.directive.flat) ? loc.fileName : loc.dirName,
            locDirPath: (loc, config) => path.join(loc.dirPath, loc.dirName),
            declaration: 'directive',
            files: [
                { name: config => `directive.ts`, type: template_type_1.TemplateType.Directive },
                { name: config => `directive.spec.ts`, type: template_type_1.TemplateType.DirectiveSpec, condition: (config, params) => config.defaults.directive.spec },
            ],
            createFolder: config => !config.defaults.directive.flat,
            options: [option_type_1.OptionType.Prefix,
                option_type_1.OptionType.Spec,
                option_type_1.OptionType.SkipImport,
                option_type_1.OptionType.Selector,
                option_type_1.OptionType.Flat,
                option_type_1.OptionType.Module,
                option_type_1.OptionType.Export],
        }],
    [resource_type_1.ResourceType.Component, {
            locDirName: (loc, config) => (!config.defaults.component.flat) ? loc.fileName : loc.dirName,
            locDirPath: (loc, config) => path.join(loc.dirPath, loc.dirName),
            declaration: 'component',
            files: [{ name: config => `component.ts`, type: template_type_1.TemplateType.Component },
                { name: config => `component.${config.defaults.component.styleext || config.defaults.styleExt}`, type: template_type_1.TemplateType.ComponentStyle, condition: (config, params) => !config.defaults.component.inlineStyle },
                { name: config => `component.html`, type: template_type_1.TemplateType.ComponentHtml, condition: (config, params) => !config.defaults.component.inlineTemplate },
                { name: config => `component.spec.ts`, type: template_type_1.TemplateType.ConponentSpec, condition: (config, params) => config.defaults.component.spec },
            ],
            createFolder: config => !config.defaults.component.flat,
            options: [option_type_1.OptionType.InlineStyle,
                option_type_1.OptionType.InlineTemplate,
                option_type_1.OptionType.ViewEncapsulation,
                option_type_1.OptionType.ChangeDetection,
                option_type_1.OptionType.Prefix,
                option_type_1.OptionType.Styleext,
                option_type_1.OptionType.Spec,
                option_type_1.OptionType.Flat,
                option_type_1.OptionType.SkipImport,
                option_type_1.OptionType.Selector,
                option_type_1.OptionType.Module,
                option_type_1.OptionType.Export],
        }],
]);
//# sourceMappingURL=resources.js.map