"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextValue = void 0;
const value_1 = require("./value");
const valueArrayValueType_1 = require("./valueArrayValueType");
class TextValue extends valueArrayValueType_1.ValueArrayValueType {
    constructor(ID, values, size, name, game) {
        super(ID, size, value_1.ValueType.text, name, game);
        this.values = values;
    }
    async get() {
        return this.values;
    }
    async set(newValue) {
        this.values = newValue;
    }
    async isTruthy() {
        return this.size > 0;
    }
}
exports.TextValue = TextValue;
//# sourceMappingURL=textValue.js.map