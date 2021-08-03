"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageValue = void 0;
const value_1 = require("./value");
class ImageValue extends value_1.Value {
    constructor(ID, data, width, height, keyColor, name, game) {
        super(ID, value_1.ValueType.image, name, game);
        this.data = data;
        this.width = width;
        this.height = height;
        this.keyColor = keyColor;
    }
    async get() {
        return {
            data: await this.data.getValue(),
            width: await this.width.getValue(),
            height: await this.height.getValue(),
            keyColor: await this.keyColor.getValue()
        };
    }
    async set(a) {
    }
    async isTruthy() {
        return true;
    }
}
exports.ImageValue = ImageValue;
//# sourceMappingURL=imageValue.js.map