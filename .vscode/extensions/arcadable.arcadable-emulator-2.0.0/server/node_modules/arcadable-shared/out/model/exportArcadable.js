"use strict";
exports.__esModule = true;
exports.exportArcadable = void 0;
var instruction_1 = require("./instructions/instruction");
var value_1 = require("./values/value");
var fp = require('ieee-float');
function exportArcadable(game) {
    var binaryString = '';
    var tempBinaryString = Object.keys(game.unchangedValues).filter(function (k) { return game.unchangedValues[Number(k)].type === value_1.ValueType.analogInputPointer; }).reduce(function (acc, curr) {
        return acc +
            makeLength(game.unchangedValues[Number(curr)].ID.toString(2), 16) +
            makeLength((game.unchangedValues[Number(curr)]).index.toString(2), 8);
    }, makeLength(value_1.ValueType.analogInputPointer.toString(2), 8));
    if (tempBinaryString.length > 8) {
        binaryString += makeLength((tempBinaryString.length / 8).toString(2), 16);
        binaryString += tempBinaryString;
    }
    tempBinaryString = Object.keys(game.unchangedValues).filter(function (k) { return game.unchangedValues[Number(k)].type === value_1.ValueType.digitalInputPointer; }).reduce(function (acc, curr) {
        return acc +
            makeLength(game.unchangedValues[Number(curr)].ID.toString(2), 16) +
            makeLength((game.unchangedValues[Number(curr)]).index.toString(2), 8);
    }, makeLength(value_1.ValueType.digitalInputPointer.toString(2), 8));
    if (tempBinaryString.length > 8) {
        binaryString += makeLength((tempBinaryString.length / 8).toString(2), 16);
        binaryString += tempBinaryString;
    }
    tempBinaryString = Object.keys(game.unchangedValues).filter(function (k) { return game.unchangedValues[Number(k)].type === value_1.ValueType.speakerOutputPointer; }).reduce(function (acc, curr) {
        return acc +
            makeLength(game.unchangedValues[Number(curr)].ID.toString(2), 16) +
            makeLength((game.unchangedValues[Number(curr)]).index.toString(2), 8);
    }, makeLength(value_1.ValueType.speakerOutputPointer.toString(2), 8));
    if (tempBinaryString.length > 8) {
        binaryString += makeLength((tempBinaryString.length / 8).toString(2), 16);
        binaryString += tempBinaryString;
    }
    tempBinaryString = Object.keys(game.unchangedValues).filter(function (k) { return game.unchangedValues[Number(k)].type === value_1.ValueType.evaluation; }).reduce(function (acc, curr) {
        return acc +
            makeLength(game.unchangedValues[Number(curr)].ID.toString(2), 16) +
            makeLength((game.unchangedValues[Number(curr)]).evaluationOperator.toString(2), 7) +
            ((game.unchangedValues[Number(curr)]).isStatic ? '1' : '0') +
            makeLength((game.unchangedValues[Number(curr)]).left.ID.toString(2), 16) +
            makeLength((game.unchangedValues[Number(curr)]).right.ID.toString(2), 16);
    }, makeLength(value_1.ValueType.evaluation.toString(2), 8));
    if (tempBinaryString.length > 8) {
        binaryString += makeLength((tempBinaryString.length / 8).toString(2), 16);
        binaryString += tempBinaryString;
    }
    tempBinaryString = Object.keys(game.unchangedValues).filter(function (k) { return game.unchangedValues[Number(k)].type === value_1.ValueType.listDeclaration; }).reduce(function (acc, curr) {
        return acc +
            makeLength(game.unchangedValues[Number(curr)].ID.toString(2), 16) +
            makeLength((game.unchangedValues[Number(curr)]).size.toString(2), 16) +
            (game.unchangedValues[Number(curr)]).values.reduce(function (a, c) { return a + makeLength(c.ID.toString(2), 16); }, '');
    }, makeLength(value_1.ValueType.listDeclaration.toString(2), 8));
    if (tempBinaryString.length > 8) {
        binaryString += makeLength((tempBinaryString.length / 8).toString(2), 16);
        binaryString += tempBinaryString;
    }
    tempBinaryString = Object.keys(game.unchangedValues).filter(function (k) { return game.unchangedValues[Number(k)].type === value_1.ValueType.listValue; }).reduce(function (acc, curr) {
        return acc +
            makeLength(game.unchangedValues[Number(curr)].ID.toString(2), 16) +
            makeLength((game.unchangedValues[Number(curr)]).listValue.ID.toString(2), 16) +
            makeLength((game.unchangedValues[Number(curr)]).listIndex.ID.toString(2), 16);
    }, makeLength(value_1.ValueType.listValue.toString(2), 8));
    if (tempBinaryString.length > 8) {
        binaryString += makeLength((tempBinaryString.length / 8).toString(2), 16);
        binaryString += tempBinaryString;
    }
    tempBinaryString = Object.keys(game.unchangedValues).filter(function (k) { return game.unchangedValues[Number(k)].type === value_1.ValueType.number; }).reduce(function (acc, curr) {
        var output = [];
        fp.writeFloatBE(output, (game.unchangedValues[Number(curr)]).value);
        return acc +
            makeLength(game.unchangedValues[Number(curr)].ID.toString(2), 16) +
            output.reduce(function (a, c) { return a + makeLength(c.toString(2), 8); }, '');
    }, makeLength(value_1.ValueType.number.toString(2), 8));
    if (tempBinaryString.length > 8) {
        binaryString += makeLength((tempBinaryString.length / 8).toString(2), 16);
        binaryString += tempBinaryString;
    }
    tempBinaryString = Object.keys(game.unchangedValues).filter(function (k) { return game.unchangedValues[Number(k)].type === value_1.ValueType.pixelIndex; }).reduce(function (acc, curr) {
        return acc +
            makeLength(game.unchangedValues[Number(curr)].ID.toString(2), 16) +
            makeLength((game.unchangedValues[Number(curr)]).XCalc.ID.toString(2), 16) +
            makeLength((game.unchangedValues[Number(curr)]).YCalc.ID.toString(2), 16);
    }, makeLength(value_1.ValueType.pixelIndex.toString(2), 8));
    if (tempBinaryString.length > 8) {
        binaryString += makeLength((tempBinaryString.length / 8).toString(2), 16);
        binaryString += tempBinaryString;
    }
    tempBinaryString = Object.keys(game.unchangedValues).filter(function (k) { return game.unchangedValues[Number(k)].type === value_1.ValueType.image; }).reduce(function (acc, curr) {
        return acc +
            makeLength(game.unchangedValues[Number(curr)].ID.toString(2), 16) +
            makeLength((game.unchangedValues[Number(curr)]).data.ID.toString(2), 16) +
            makeLength((game.unchangedValues[Number(curr)]).width.ID.toString(2), 16) +
            makeLength((game.unchangedValues[Number(curr)]).height.ID.toString(2), 16) +
            makeLength((game.unchangedValues[Number(curr)]).keyColor.ID.toString(2), 16);
    }, makeLength(value_1.ValueType.image.toString(2), 8));
    if (tempBinaryString.length > 8) {
        binaryString += makeLength((tempBinaryString.length / 8).toString(2), 16);
        binaryString += tempBinaryString;
    }
    tempBinaryString = Object.keys(game.unchangedValues).filter(function (k) { return game.unchangedValues[Number(k)].type === value_1.ValueType.data; }).reduce(function (acc, curr) {
        return acc +
            makeLength(game.unchangedValues[Number(curr)].ID.toString(2), 16) +
            makeLength((game.unchangedValues[Number(curr)]).size.toString(2), 16) +
            ((game.unchangedValues[Number(curr)]).data).reduce(function (a, c) { return a + makeLength(c.toString(2), 8); }, '');
    }, makeLength(value_1.ValueType.data.toString(2), 8));
    if (tempBinaryString.length > 8) {
        binaryString += makeLength((tempBinaryString.length / 8).toString(2), 16);
        binaryString += tempBinaryString;
    }
    tempBinaryString = Object.keys(game.unchangedValues).filter(function (k) { return game.unchangedValues[Number(k)].type === value_1.ValueType.systemPointer; }).reduce(function (acc, curr) {
        return acc +
            makeLength(game.unchangedValues[Number(curr)].ID.toString(2), 16) +
            makeLength((game.unchangedValues[Number(curr)]).configType.toString(2), 8);
    }, makeLength(value_1.ValueType.systemPointer.toString(2), 8));
    if (tempBinaryString.length > 8) {
        binaryString += makeLength((tempBinaryString.length / 8).toString(2), 16);
        binaryString += tempBinaryString;
    }
    tempBinaryString = Object.keys(game.unchangedValues).filter(function (k) { return game.unchangedValues[Number(k)].type === value_1.ValueType.text; }).reduce(function (acc, curr) {
        return acc +
            makeLength(game.unchangedValues[Number(curr)].ID.toString(2), 16) +
            makeLength((game.unchangedValues[Number(curr)]).size.toString(2), 8) +
            (game.unchangedValues[Number(curr)]).values.reduce(function (a, c) { return a + makeLength(c.ID.toString(2), 16); }, '');
    }, makeLength(value_1.ValueType.text.toString(2), 8));
    if (tempBinaryString.length > 8) {
        binaryString += makeLength((tempBinaryString.length / 8).toString(2), 16);
        binaryString += tempBinaryString;
    }
    tempBinaryString = Object.keys(game.instructions).filter(function (k) { return game.instructions[Number(k)].instructionType === instruction_1.InstructionType.Clear; }).reduce(function (acc, curr) {
        return acc +
            makeLength(game.instructions[Number(curr)].ID.toString(2), 16);
    }, makeLength((instruction_1.InstructionType.Clear + 128).toString(2), 8));
    if (tempBinaryString.length > 8) {
        binaryString += makeLength((tempBinaryString.length / 8).toString(2), 16);
        binaryString += tempBinaryString;
    }
    tempBinaryString = Object.keys(game.instructions).filter(function (k) { return game.instructions[Number(k)].instructionType === instruction_1.InstructionType.DrawCircle; }).reduce(function (acc, curr) {
        return acc +
            makeLength(game.instructions[Number(curr)].ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).colorValue.ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).radiusValue.ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).xValue.ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).yValue.ID.toString(2), 16);
    }, makeLength((instruction_1.InstructionType.DrawCircle + 128).toString(2), 8));
    if (tempBinaryString.length > 8) {
        binaryString += makeLength((tempBinaryString.length / 8).toString(2), 16);
        binaryString += tempBinaryString;
    }
    tempBinaryString = Object.keys(game.instructions).filter(function (k) { return game.instructions[Number(k)].instructionType === instruction_1.InstructionType.FillCircle; }).reduce(function (acc, curr) {
        return acc +
            makeLength(game.instructions[Number(curr)].ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).colorValue.ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).radiusValue.ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).xValue.ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).yValue.ID.toString(2), 16);
    }, makeLength((instruction_1.InstructionType.FillCircle + 128).toString(2), 8));
    if (tempBinaryString.length > 8) {
        binaryString += makeLength((tempBinaryString.length / 8).toString(2), 16);
        binaryString += tempBinaryString;
    }
    tempBinaryString = Object.keys(game.instructions).filter(function (k) { return game.instructions[Number(k)].instructionType === instruction_1.InstructionType.DrawLine; }).reduce(function (acc, curr) {
        return acc +
            makeLength(game.instructions[Number(curr)].ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).colorValue.ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).x1Value.ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).y1Value.ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).x2Value.ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).y2Value.ID.toString(2), 16);
    }, makeLength((instruction_1.InstructionType.DrawLine + 128).toString(2), 8));
    if (tempBinaryString.length > 8) {
        binaryString += makeLength((tempBinaryString.length / 8).toString(2), 16);
        binaryString += tempBinaryString;
    }
    tempBinaryString = Object.keys(game.instructions).filter(function (k) { return game.instructions[Number(k)].instructionType === instruction_1.InstructionType.DrawPixel; }).reduce(function (acc, curr) {
        return acc +
            makeLength(game.instructions[Number(curr)].ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).colorValue.ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).xValue.ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).yValue.ID.toString(2), 16);
    }, makeLength((instruction_1.InstructionType.DrawPixel + 128).toString(2), 8));
    if (tempBinaryString.length > 8) {
        binaryString += makeLength((tempBinaryString.length / 8).toString(2), 16);
        binaryString += tempBinaryString;
    }
    tempBinaryString = Object.keys(game.instructions).filter(function (k) { return game.instructions[Number(k)].instructionType === instruction_1.InstructionType.DrawRect; }).reduce(function (acc, curr) {
        return acc +
            makeLength(game.instructions[Number(curr)].ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).colorValue.ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).x1Value.ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).y1Value.ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).x2Value.ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).y2Value.ID.toString(2), 16);
    }, makeLength((instruction_1.InstructionType.DrawRect + 128).toString(2), 8));
    if (tempBinaryString.length > 8) {
        binaryString += makeLength((tempBinaryString.length / 8).toString(2), 16);
        binaryString += tempBinaryString;
    }
    tempBinaryString = Object.keys(game.instructions).filter(function (k) { return game.instructions[Number(k)].instructionType === instruction_1.InstructionType.FillRect; }).reduce(function (acc, curr) {
        return acc +
            makeLength(game.instructions[Number(curr)].ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).colorValue.ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).x1Value.ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).y1Value.ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).x2Value.ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).y2Value.ID.toString(2), 16);
    }, makeLength((instruction_1.InstructionType.FillRect + 128).toString(2), 8));
    if (tempBinaryString.length > 8) {
        binaryString += makeLength((tempBinaryString.length / 8).toString(2), 16);
        binaryString += tempBinaryString;
    }
    tempBinaryString = Object.keys(game.instructions).filter(function (k) { return game.instructions[Number(k)].instructionType === instruction_1.InstructionType.DrawText; }).reduce(function (acc, curr) {
        return acc +
            makeLength(game.instructions[Number(curr)].ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).colorValue.ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).xValue.ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).yValue.ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).scaleValue.ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).textValue.ID.toString(2), 16);
    }, makeLength((instruction_1.InstructionType.DrawText + 128).toString(2), 8));
    if (tempBinaryString.length > 8) {
        binaryString += makeLength((tempBinaryString.length / 8).toString(2), 16);
        binaryString += tempBinaryString;
    }
    tempBinaryString = Object.keys(game.instructions).filter(function (k) { return game.instructions[Number(k)].instructionType === instruction_1.InstructionType.DrawTriangle; }).reduce(function (acc, curr) {
        return acc +
            makeLength(game.instructions[Number(curr)].ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).colorValue.ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).x1Value.ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).y1Value.ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).x2Value.ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).y2Value.ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).x3Value.ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).y3Value.ID.toString(2), 16);
    }, makeLength((instruction_1.InstructionType.DrawTriangle + 128).toString(2), 8));
    if (tempBinaryString.length > 8) {
        binaryString += makeLength((tempBinaryString.length / 8).toString(2), 16);
        binaryString += tempBinaryString;
    }
    tempBinaryString = Object.keys(game.instructions).filter(function (k) { return game.instructions[Number(k)].instructionType === instruction_1.InstructionType.FillTriangle; }).reduce(function (acc, curr) {
        return acc +
            makeLength(game.instructions[Number(curr)].ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).colorValue.ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).x1Value.ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).y1Value.ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).x2Value.ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).y2Value.ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).x3Value.ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).y3Value.ID.toString(2), 16);
    }, makeLength((instruction_1.InstructionType.FillTriangle + 128).toString(2), 8));
    if (tempBinaryString.length > 8) {
        binaryString += makeLength((tempBinaryString.length / 8).toString(2), 16);
        binaryString += tempBinaryString;
    }
    tempBinaryString = Object.keys(game.instructions).filter(function (k) { return game.instructions[Number(k)].instructionType === instruction_1.InstructionType.DrawImage; }).reduce(function (acc, curr) {
        return acc +
            makeLength(game.instructions[Number(curr)].ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).xValue.ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).yValue.ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).imageValue.ID.toString(2), 16);
    }, makeLength((instruction_1.InstructionType.DrawImage + 128).toString(2), 8));
    if (tempBinaryString.length > 8) {
        binaryString += makeLength((tempBinaryString.length / 8).toString(2), 16);
        binaryString += tempBinaryString;
    }
    tempBinaryString = Object.keys(game.instructions).filter(function (k) { return game.instructions[Number(k)].instructionType === instruction_1.InstructionType.MutateValue; }).reduce(function (acc, curr) {
        return acc +
            makeLength(game.instructions[Number(curr)].ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).leftValue.ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).rightValue.ID.toString(2), 16);
    }, makeLength((instruction_1.InstructionType.MutateValue + 128).toString(2), 8));
    if (tempBinaryString.length > 8) {
        binaryString += makeLength((tempBinaryString.length / 8).toString(2), 16);
        binaryString += tempBinaryString;
    }
    tempBinaryString = Object.keys(game.instructions).filter(function (k) { return game.instructions[Number(k)].instructionType === instruction_1.InstructionType.RunCondition && !game.instructions[Number(k)].await; }).reduce(function (acc, curr) {
        return acc +
            makeLength(game.instructions[Number(curr)].ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).evaluationValue.ID.toString(2), 16) +
            ((game.instructions[Number(curr)]).failSet ? makeLength((game.instructions[Number(curr)]).failSet.ID.toString(2), 16) : '1111111111111111') +
            makeLength((game.instructions[Number(curr)]).successSet.ID.toString(2), 16);
    }, makeLength((instruction_1.InstructionType.RunCondition + 128).toString(2), 8));
    if (tempBinaryString.length > 8) {
        binaryString += makeLength((tempBinaryString.length / 8).toString(2), 16);
        binaryString += tempBinaryString;
    }
    tempBinaryString = Object.keys(game.instructions).filter(function (k) { return game.instructions[Number(k)].instructionType === instruction_1.InstructionType.RunCondition && !!game.instructions[Number(k)].await; }).reduce(function (acc, curr) {
        return acc +
            makeLength(game.instructions[Number(curr)].ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).evaluationValue.ID.toString(2), 16) +
            ((game.instructions[Number(curr)]).failSet ? makeLength((game.instructions[Number(curr)]).failSet.ID.toString(2), 16) : '1111111111111111') +
            makeLength((game.instructions[Number(curr)]).successSet.ID.toString(2), 16);
    }, makeLength((instruction_1.InstructionType.AwaitedRunCondition + 128).toString(2), 8));
    if (tempBinaryString.length > 8) {
        binaryString += makeLength((tempBinaryString.length / 8).toString(2), 16);
        binaryString += tempBinaryString;
    }
    tempBinaryString = Object.keys(game.instructions).filter(function (k) { return game.instructions[Number(k)].instructionType === instruction_1.InstructionType.SetRotation; }).reduce(function (acc, curr) {
        return acc +
            makeLength(game.instructions[Number(curr)].ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).rotationValue.ID.toString(2), 16);
    }, makeLength((instruction_1.InstructionType.SetRotation + 128).toString(2), 8));
    if (tempBinaryString.length > 8) {
        binaryString += makeLength((tempBinaryString.length / 8).toString(2), 16);
        binaryString += tempBinaryString;
    }
    tempBinaryString = Object.keys(game.instructions).filter(function (k) { return game.instructions[Number(k)].instructionType === instruction_1.InstructionType.RunSet && !game.instructions[Number(k)].await; }).reduce(function (acc, curr) {
        return acc +
            makeLength(game.instructions[Number(curr)].ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).set.ID.toString(2), 16);
    }, makeLength((instruction_1.InstructionType.RunSet + 128).toString(2), 8));
    if (tempBinaryString.length > 8) {
        binaryString += makeLength((tempBinaryString.length / 8).toString(2), 16);
        binaryString += tempBinaryString;
    }
    tempBinaryString = Object.keys(game.instructions).filter(function (k) { return game.instructions[Number(k)].instructionType === instruction_1.InstructionType.RunSet && !!game.instructions[Number(k)].await; }).reduce(function (acc, curr) {
        return acc +
            makeLength(game.instructions[Number(curr)].ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).set.ID.toString(2), 16);
    }, makeLength((instruction_1.InstructionType.AwaitedRunSet + 128).toString(2), 8));
    if (tempBinaryString.length > 8) {
        binaryString += makeLength((tempBinaryString.length / 8).toString(2), 16);
        binaryString += tempBinaryString;
    }
    tempBinaryString = Object.keys(game.instructions).filter(function (k) { return game.instructions[Number(k)].instructionType === instruction_1.InstructionType.DebugLog; }).reduce(function (acc, curr) {
        return acc +
            makeLength(game.instructions[Number(curr)].ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).logValue.ID.toString(2), 16);
    }, makeLength((instruction_1.InstructionType.DebugLog + 128).toString(2), 8));
    if (tempBinaryString.length > 8) {
        binaryString += makeLength((tempBinaryString.length / 8).toString(2), 16);
        binaryString += tempBinaryString;
    }
    tempBinaryString = Object.keys(game.instructions).filter(function (k) { return game.instructions[Number(k)].instructionType === instruction_1.InstructionType.Wait; }).reduce(function (acc, curr) {
        return acc +
            makeLength(game.instructions[Number(curr)].ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).amountValue.ID.toString(2), 16);
    }, makeLength((instruction_1.InstructionType.Wait + 128).toString(2), 8));
    if (tempBinaryString.length > 8) {
        binaryString += makeLength((tempBinaryString.length / 8).toString(2), 16);
        binaryString += tempBinaryString;
    }
    tempBinaryString = Object.keys(game.instructions).filter(function (k) { return game.instructions[Number(k)].instructionType === instruction_1.InstructionType.Tone && !game.instructions[Number(k)].await; }).reduce(function (acc, curr) {
        return acc +
            makeLength(game.instructions[Number(curr)].ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).speakerOutputValue.ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).volumeValue.ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).frequencyValue.ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).durationValue.ID.toString(2), 16);
    }, makeLength((instruction_1.InstructionType.Tone + 128).toString(2), 8));
    if (tempBinaryString.length > 8) {
        binaryString += makeLength((tempBinaryString.length / 8).toString(2), 16);
        binaryString += tempBinaryString;
    }
    tempBinaryString = Object.keys(game.instructions).filter(function (k) { return game.instructions[Number(k)].instructionType === instruction_1.InstructionType.Tone && !!game.instructions[Number(k)].await; }).reduce(function (acc, curr) {
        return acc +
            makeLength(game.instructions[Number(curr)].ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).speakerOutputValue.ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).volumeValue.ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).frequencyValue.ID.toString(2), 16) +
            makeLength((game.instructions[Number(curr)]).durationValue.ID.toString(2), 16);
    }, makeLength((instruction_1.InstructionType.AwaitedTone + 128).toString(2), 8));
    if (tempBinaryString.length > 8) {
        binaryString += makeLength((tempBinaryString.length / 8).toString(2), 16);
        binaryString += tempBinaryString;
    }
    var setupSet = game.instructionSets[game.setupInstructionSet];
    var mainSet = game.instructionSets[game.mainInstructionSet];
    var renderSet = game.instructionSets[game.renderInstructionSet];
    tempBinaryString = makeLength((instruction_1.InstructionType.InstructionSet + 128).toString(2), 8) +
        makeLength(setupSet.ID.toString(2), 16) +
        (setupSet.async ? '1' : '0') +
        makeLength(setupSet.size.toString(2), 15) +
        setupSet.instructions.reduce(function (a, c) { return a + makeLength(c.ID.toString(2), 16); }, '') +
        makeLength(mainSet.ID.toString(2), 16) +
        (mainSet.async ? '1' : '0') +
        makeLength(mainSet.size.toString(2), 15) +
        mainSet.instructions.reduce(function (a, c) { return a + makeLength(c.ID.toString(2), 16); }, '') +
        makeLength(renderSet.ID.toString(2), 16) +
        (renderSet.async ? '1' : '0') +
        makeLength(renderSet.size.toString(2), 15) +
        renderSet.instructions.reduce(function (a, c) { return a + makeLength(c.ID.toString(2), 16); }, '') +
        Object.keys(game.instructionSets).filter(function (k) {
            return +k !== game.setupInstructionSet &&
                +k !== game.mainInstructionSet &&
                +k !== game.renderInstructionSet;
        }).reduce(function (acc, curr) {
            return acc +
                makeLength(game.instructionSets[Number(curr)].ID.toString(2), 16) +
                (game.instructionSets[Number(curr)].async ? '1' : '0') +
                makeLength(game.instructionSets[Number(curr)].size.toString(2), 15) +
                game.instructionSets[Number(curr)].instructions.reduce(function (a, c) { return a + makeLength(c.ID.toString(2), 16); }, '');
        }, '');
    binaryString += makeLength((tempBinaryString.length / 8).toString(2), 16);
    binaryString += tempBinaryString;
    var numbers = [];
    var index = 0;
    while (binaryString.length > 0) {
        numbers[index] = parseInt(binaryString.substring(0, 8), 2);
        binaryString = binaryString.substring(8);
        index++;
    }
    var bytes = Uint8Array.from(numbers);
    return bytes;
}
exports.exportArcadable = exportArcadable;
function makeLength(value, length, signed) {
    var returnValue = value;
    var negative = false;
    if (signed && returnValue.charAt(0) === '-') {
        negative = true;
        returnValue = returnValue.substr(1);
    }
    if (returnValue.length < length) {
        for (var i = 0; i < length - value.length; i++) {
            returnValue = '0' + returnValue;
        }
    }
    else if (returnValue.length > length) {
        returnValue = returnValue.substring(returnValue.length - length);
    }
    if (signed) {
        returnValue = negative ? '1' + returnValue : returnValue;
    }
    return returnValue;
}
