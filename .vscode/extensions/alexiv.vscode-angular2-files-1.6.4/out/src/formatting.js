"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toUpperCase = exports.toTileCase = exports.toCamelCase = void 0;
exports.toCamelCase = (input) => input.replace(/-([a-z])/ig, (all, letter) => letter.toUpperCase());
exports.toTileCase = (str) => str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
exports.toUpperCase = (input) => exports.toCamelCase(input.charAt(0).toUpperCase() + input.slice(1));
//# sourceMappingURL=formatting.js.map