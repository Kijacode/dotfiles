"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrawLineInstruction = void 0;
const callStack_1 = require("../callStack");
const instruction_1 = require("./instruction");
class DrawLineInstruction extends instruction_1.Instruction {
    constructor(ID, colorValue, x1Value, y1Value, x2Value, y2Value, name, game, await) {
        super(ID, instruction_1.InstructionType.DrawLine, name, game, await);
        this.colorValue = colorValue;
        this.x1Value = x1Value;
        this.y1Value = y1Value;
        this.x2Value = x2Value;
        this.y2Value = y2Value;
        this.await = await;
    }
    async getExecutables(async) {
        return [new callStack_1.Executable(async () => {
                const [pos1X, pos1Y, pos2X, pos2Y, lineColor] = await Promise.all([
                    this.x1Value.getValue(),
                    this.y1Value.getValue(),
                    this.x2Value.getValue(),
                    this.y2Value.getValue(),
                    this.colorValue.getValue()
                ]);
                this.game.instructionEmitter.next({
                    command: 'drawLine',
                    lineColor,
                    pos1X,
                    pos1Y,
                    pos2X,
                    pos2Y,
                });
                return [];
            }, async, false, [], null, null)];
    }
}
exports.DrawLineInstruction = DrawLineInstruction;
//# sourceMappingURL=drawLineInstruction.js.map