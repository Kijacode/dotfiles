"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DigitalInputValue = void 0;
const _numberValueType_1 = require("./_numberValueType");
const value_1 = require("./value");
class DigitalInputValue extends _numberValueType_1.NumberValueType {
    constructor(ID, index, name, game) {
        super(ID, value_1.ValueType.digitalInputPointer, name, game);
        this.index = index;
    }
    async get() {
        return this.game.systemConfig.digitalInputValues[this.index];
    }
    async set(newValue) {
    }
    async isTruthy() {
        return await this.get() !== 0;
    }
}
exports.DigitalInputValue = DigitalInputValue;
//# sourceMappingURL=digitalInputValue.js.map