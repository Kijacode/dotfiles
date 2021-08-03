"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrawTextInstruction = void 0;
const instruction_1 = require("./instruction");
const callStack_1 = require("../callStack");
class DrawTextInstruction extends instruction_1.Instruction {
    constructor(ID, colorValue, scaleValue, textValue, xValue, yValue, name, game, await) {
        super(ID, instruction_1.InstructionType.DrawText, name, game, await);
        this.colorValue = colorValue;
        this.scaleValue = scaleValue;
        this.textValue = textValue;
        this.xValue = xValue;
        this.yValue = yValue;
        this.await = await;
    }
    async getExecutables(async) {
        return [new callStack_1.Executable(async () => {
                let [pixelTextX, pixelTextY, scale, textColor, text,] = await Promise.all([
                    this.xValue.getValue(),
                    this.yValue.getValue(),
                    this.scaleValue.getValue(),
                    this.colorValue.getValue(),
                    this.textValue.getValue()
                ]);
                const textvalue = await text.reduce(async (acc, curr) => {
                    return (await acc) + String.fromCharCode(await curr.getValue());
                }, new Promise(res => res('')));
                this.game.instructionEmitter.next({
                    command: 'drawText',
                    pixelTextX,
                    pixelTextY,
                    scale,
                    textColor,
                    textvalue,
                });
                return [];
            }, async, false, [], null, null)];
    }
}
exports.DrawTextInstruction = DrawTextInstruction;
//# sourceMappingURL=drawTextInstruction.js.map