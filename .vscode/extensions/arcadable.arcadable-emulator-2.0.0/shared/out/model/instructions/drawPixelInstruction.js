"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrawPixelInstruction = void 0;
const callStack_1 = require("../callStack");
const instruction_1 = require("./instruction");
class DrawPixelInstruction extends instruction_1.Instruction {
    constructor(ID, colorValue, xValue, yValue, name, game, await) {
        super(ID, instruction_1.InstructionType.DrawPixel, name, game, await);
        this.colorValue = colorValue;
        this.xValue = xValue;
        this.yValue = yValue;
        this.await = await;
    }
    async getExecutables(async) {
        return [new callStack_1.Executable(async () => {
                const [x, y, pixelColor] = await Promise.all([
                    this.xValue.getValue(),
                    this.yValue.getValue(),
                    this.colorValue.getValue(),
                ]);
                this.game.instructionEmitter.next({
                    command: 'drawPixel',
                    x,
                    y,
                    pixelColor,
                });
                return [];
            }, async, false, [], null, null)];
    }
}
exports.DrawPixelInstruction = DrawPixelInstruction;
//# sourceMappingURL=drawPixelInstruction.js.map