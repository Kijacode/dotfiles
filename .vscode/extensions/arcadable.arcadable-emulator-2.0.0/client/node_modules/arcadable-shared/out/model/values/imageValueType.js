"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageValueTypePointer = exports.ImageValueType = void 0;
const value_1 = require("./value");
class ImageValueType extends value_1.Value {
}
exports.ImageValueType = ImageValueType;
class ImageValueTypePointer extends value_1.ValuePointer {
    getObject() {
        return this.game.values[this.ID];
    }
    async getValue() {
        return await this.game.values[this.ID].get();
    }
}
exports.ImageValueTypePointer = ImageValueTypePointer;
//# sourceMappingURL=imageValueType.js.map