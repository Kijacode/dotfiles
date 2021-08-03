"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (text) => {
    const words = text.split(/[ ]/g);
    const wordsLowercase = words.map(word => word.toLowerCase());
    const finalText = wordsLowercase.join('-');
    return finalText;
};
//# sourceMappingURL=toKebabLowercase.js.map