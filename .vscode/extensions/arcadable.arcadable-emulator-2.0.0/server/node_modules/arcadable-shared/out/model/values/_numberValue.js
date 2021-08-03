"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberValue = void 0;
const _numberValueType_1 = require("./_numberValueType");
const value_1 = require("./value");
class NumberValue extends _numberValueType_1.NumberValueType {
    constructor(ID, value, size, name, game) {
        super(ID, value_1.ValueType.number, name, game);
        this.value = value;
        this.size = size;
    }
    async get() {
        return this.value;
    }
    async set(newValue) {
        this.value = newValue;
    }
    async isTruthy() {
        return (await this.get()) !== 0;
    }
}
exports.NumberValue = NumberValue;
//# sourceMappingURL=_numberValue.js.map