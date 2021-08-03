"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatFilename = void 0;
exports.formatFilename = (s) => {
    const [first, ...rest] = s.split(".");
    return [first, "vcode-story", ...rest].join(".");
};
//# sourceMappingURL=formatFilename.js.map