"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalogInputValue = void 0;
const _numberValueType_1 = require("./_numberValueType");
const value_1 = require("./value");
class AnalogInputValue extends _numberValueType_1.NumberValueType {
    constructor(ID, index, name, game) {
        super(ID, value_1.ValueType.analogInputPointer, name, game);
        this.index = index;
    }
    async get() {
        return this.game.systemConfig.analogInputValues[this.index];
    }
    async set(newValue) {
    }
    async isTruthy() {
        return await this.get() !== 0;
    }
}
exports.AnalogInputValue = AnalogInputValue;
//# sourceMappingURL=analogInputValue.js.map