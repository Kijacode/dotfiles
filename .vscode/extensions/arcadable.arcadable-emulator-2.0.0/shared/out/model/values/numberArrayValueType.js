"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberArrayValueTypePointer = exports.NumberArrayValueType = void 0;
const value_1 = require("./value");
class NumberArrayValueType extends value_1.Value {
    constructor(ID, size, type, name, game) {
        super(ID, type, name, game);
        this.size = size;
    }
}
exports.NumberArrayValueType = NumberArrayValueType;
class NumberArrayValueTypePointer extends value_1.ValuePointer {
    getObject() {
        return this.game.values[this.ID];
    }
    async getValue() {
        return await this.game.values[this.ID].get();
    }
}
exports.NumberArrayValueTypePointer = NumberArrayValueTypePointer;
//# sourceMappingURL=numberArrayValueType.js.map