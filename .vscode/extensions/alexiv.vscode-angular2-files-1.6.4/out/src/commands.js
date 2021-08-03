"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandsMap = void 0;
const resource_type_1 = require("./enums/resource-type");
const command_type_1 = require("./enums/command-type");
exports.commandsMap = new Map([
    [command_type_1.CommandType.Component, { fileName: 'my-component', resource: resource_type_1.ResourceType.Component }],
    [command_type_1.CommandType.Directive, { fileName: 'my-directive', resource: resource_type_1.ResourceType.Directive }],
    [command_type_1.CommandType.Pipe, { fileName: 'my-pipe', resource: resource_type_1.ResourceType.Pipe }],
    [command_type_1.CommandType.Service, { fileName: 'my-service', resource: resource_type_1.ResourceType.Service }],
    [command_type_1.CommandType.Class, { fileName: 'my-class', resource: resource_type_1.ResourceType.Class }],
    [command_type_1.CommandType.Interface, { fileName: 'my-interface', resource: resource_type_1.ResourceType.Interface }],
    [command_type_1.CommandType.Route, { fileName: 'my-route', resource: resource_type_1.ResourceType.Route }],
    [command_type_1.CommandType.Enum, { fileName: 'my-enum', resource: resource_type_1.ResourceType.Enum }],
    [command_type_1.CommandType.Module, { fileName: 'my-module', resource: resource_type_1.ResourceType.Module }],
]);
//# sourceMappingURL=commands.js.map