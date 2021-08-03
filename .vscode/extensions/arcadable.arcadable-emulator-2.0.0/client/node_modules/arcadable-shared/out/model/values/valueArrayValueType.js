"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValueArrayValueTypePointer = exports.ValueArrayValueType = void 0;
const value_1 = require("./value");
class ValueArrayValueType extends value_1.Value {
    constructor(ID, size, type, name, game) {
        super(ID, type, name, game);
        this.size = size;
    }
}
exports.ValueArrayValueType = ValueArrayValueType;
class ValueArrayValueTypePointer extends value_1.ValuePointer {
    getObject() {
        return this.game.values[this.ID];
    }
    async getValue() {
        return await this.game.values[this.ID].get();
    }
}
exports.ValueArrayValueTypePointer = ValueArrayValueTypePointer;
//# sourceMappingURL=valueArrayValueType.js.map