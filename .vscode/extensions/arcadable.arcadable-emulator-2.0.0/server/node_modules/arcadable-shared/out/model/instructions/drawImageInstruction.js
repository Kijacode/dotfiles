"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrawImageInstruction = void 0;
const instruction_1 = require("./instruction");
const callStack_1 = require("../callStack");
class DrawImageInstruction extends instruction_1.Instruction {
    constructor(ID, xValue, yValue, imageValue, name, game, await) {
        super(ID, instruction_1.InstructionType.DrawImage, name, game, await);
        this.xValue = xValue;
        this.yValue = yValue;
        this.imageValue = imageValue;
        this.await = await;
    }
    async getExecutables(async) {
        return [new callStack_1.Executable(async () => {
                const [x, y, data] = await Promise.all([
                    this.xValue.getValue(),
                    this.yValue.getValue(),
                    this.imageValue.getValue()
                ]);
                this.game.instructionEmitter.next({
                    command: 'drawImage',
                    x,
                    y,
                    w: data.width,
                    h: data.height,
                    keyColor: data.keyColor,
                    data: data.data
                });
                return [];
            }, async, false, [], null, null)];
    }
}
exports.DrawImageInstruction = DrawImageInstruction;
//# sourceMappingURL=drawImageInstruction.js.map