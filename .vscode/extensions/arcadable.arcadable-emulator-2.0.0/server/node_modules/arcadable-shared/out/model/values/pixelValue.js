"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PixelValue = void 0;
const _numberValueType_1 = require("./_numberValueType");
const value_1 = require("./value");
class PixelValue extends _numberValueType_1.NumberValueType {
    constructor(ID, XCalc, YCalc, name, game) {
        super(ID, value_1.ValueType.pixelIndex, name, game);
        this.XCalc = XCalc;
        this.YCalc = YCalc;
    }
    async get() {
        const x = await this.XCalc.getValue();
        const y = await this.YCalc.getValue();
        const color = await new Promise((res, rej) => {
            this.game.instructionEmitter.next({
                command: 'getPixel',
                x,
                y,
                callback: (color) => {
                    res(color);
                }
            });
        });
        return color;
    }
    async set(newValue) {
        const x = await this.XCalc.getValue();
        const y = await this.YCalc.getValue();
        this.game.instructionEmitter.next({
            command: 'drawPixel',
            x,
            y,
            pixelColor: newValue,
        });
    }
    async isTruthy() {
        return (await this.get()) !== 0;
    }
}
exports.PixelValue = PixelValue;
//# sourceMappingURL=pixelValue.js.map