"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (text) => {
    const words = text.split(/[\. ~*-]/g);
    const wordsCapialized = words.map(word => {
        if (word.length === 1) {
            return word;
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
    });
    const finalText = wordsCapialized.join(' ').trim();
    return finalText;
};
//# sourceMappingURL=toTitleCase.js.map