"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FillTriangleInstruction = void 0;
const callStack_1 = require("../callStack");
const instruction_1 = require("./instruction");
class FillTriangleInstruction extends instruction_1.Instruction {
    constructor(ID, colorValue, x1Value, y1Value, x2Value, y2Value, x3Value, y3Value, name, game, await) {
        super(ID, instruction_1.InstructionType.FillTriangle, name, game, await);
        this.colorValue = colorValue;
        this.x1Value = x1Value;
        this.y1Value = y1Value;
        this.x2Value = x2Value;
        this.y2Value = y2Value;
        this.x3Value = x3Value;
        this.y3Value = y3Value;
        this.await = await;
    }
    async getExecutables(async) {
        return [new callStack_1.Executable(async () => {
                const [triangleColor, pixel1X, pixel1Y, pixel2X, pixel2Y, pixel3X, pixel3Y] = await Promise.all([
                    this.colorValue.getValue(),
                    this.x1Value.getValue(),
                    this.y1Value.getValue(),
                    this.x2Value.getValue(),
                    this.y2Value.getValue(),
                    this.x3Value.getValue(),
                    this.y3Value.getValue()
                ]);
                this.game.instructionEmitter.next({
                    command: 'fillTriangle',
                    triangleColor,
                    pixel1X,
                    pixel1Y,
                    pixel2X,
                    pixel2Y,
                    pixel3X,
                    pixel3Y,
                });
                return [];
            }, async, false, [], null, null)];
    }
}
exports.FillTriangleInstruction = FillTriangleInstruction;
//# sourceMappingURL=fillTriangleInstruction.js.map