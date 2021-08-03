"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrawRectInstruction = void 0;
const callStack_1 = require("../callStack");
const instruction_1 = require("./instruction");
class DrawRectInstruction extends instruction_1.Instruction {
    constructor(ID, colorValue, x1Value, y1Value, x2Value, y2Value, name, game, await) {
        super(ID, instruction_1.InstructionType.DrawRect, name, game, await);
        this.colorValue = colorValue;
        this.x1Value = x1Value;
        this.y1Value = y1Value;
        this.x2Value = x2Value;
        this.y2Value = y2Value;
        this.await = await;
    }
    async getExecutables(async) {
        return [new callStack_1.Executable(async () => {
                const [topLeftDrawX, topLeftDrawY, bottomRightDrawX, bottomRightDrawY, drawRectColor,] = await Promise.all([
                    this.x1Value.getValue(),
                    this.y1Value.getValue(),
                    this.x2Value.getValue(),
                    this.y2Value.getValue(),
                    this.colorValue.getValue()
                ]);
                const width = bottomRightDrawX - topLeftDrawX;
                const height = bottomRightDrawY - topLeftDrawY;
                this.game.instructionEmitter.next({
                    command: 'drawRect',
                    topLeftDrawX,
                    topLeftDrawY,
                    width,
                    height,
                    drawRectColor,
                });
                return [];
            }, async, false, [], null, null)];
    }
}
exports.DrawRectInstruction = DrawRectInstruction;
//# sourceMappingURL=drawRectInstruction.js.map