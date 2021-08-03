"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.ValuePointer = exports.Value = exports.valueTypes = exports.ValueType = void 0;
var logicElement_1 = require("../logicElement");
var ValueType;
(function (ValueType) {
    ValueType[ValueType["number"] = 0] = "number";
    ValueType[ValueType["pixelIndex"] = 1] = "pixelIndex";
    ValueType[ValueType["digitalInputPointer"] = 2] = "digitalInputPointer";
    ValueType[ValueType["analogInputPointer"] = 3] = "analogInputPointer";
    ValueType[ValueType["systemPointer"] = 4] = "systemPointer";
    ValueType[ValueType["listDeclaration"] = 5] = "listDeclaration";
    ValueType[ValueType["listValue"] = 6] = "listValue";
    ValueType[ValueType["text"] = 7] = "text";
    ValueType[ValueType["evaluation"] = 8] = "evaluation";
    ValueType[ValueType["image"] = 9] = "image";
    ValueType[ValueType["data"] = 10] = "data";
    ValueType[ValueType["speakerOutputPointer"] = 11] = "speakerOutputPointer";
})(ValueType = exports.ValueType || (exports.ValueType = {}));
exports.valueTypes = Object.keys(ValueType).filter(function (key) { return isNaN(Number(ValueType[key])); }).map(function (value) {
    switch (Number(value)) {
        case ValueType.number:
            return { viewValue: 'Number', codeValue: 'Number', value: Number(value) };
        case ValueType.pixelIndex:
            return { viewValue: 'Pixel', codeValue: 'Pixel', value: Number(value) };
        case ValueType.digitalInputPointer:
            return { viewValue: 'Digital input pointer', codeValue: 'Digital', value: Number(value) };
        case ValueType.analogInputPointer:
            return { viewValue: 'Analog input pointer', codeValue: 'Analog', value: Number(value) };
        case ValueType.systemPointer:
            return { viewValue: 'System value pointer', codeValue: 'Config', value: Number(value) };
        case ValueType.listValue:
            return { viewValue: 'List value pointer', codeValue: 'ListValue', value: Number(value) };
        case ValueType.listDeclaration:
            return { viewValue: 'List declaration', codeValue: 'List<>', value: Number(value) };
        case ValueType.text:
            return { viewValue: 'Text', codeValue: 'String', value: Number(value) };
        case ValueType.evaluation:
            return { viewValue: 'Evaluation', codeValue: 'Eval', value: Number(value) };
        case ValueType.image:
            return { viewValue: 'Image', codeValue: 'Image', value: Number(value) };
        case ValueType.data:
            return { viewValue: 'Data', codeValue: 'Data', value: Number(value) };
        case ValueType.speakerOutputPointer:
            return { viewValue: 'Speaker output pointer', codeValue: 'Speaker', value: Number(value) };
        default:
            return { viewValue: '', value: 0 };
    }
});
var Value = /** @class */ (function (_super) {
    __extends(Value, _super);
    function Value(ID, type, name, game) {
        var _this = _super.call(this, ID, name, game) || this;
        _this.type = type;
        return _this;
    }
    return Value;
}(logicElement_1.LogicElement));
exports.Value = Value;
var ValuePointer = /** @class */ (function () {
    function ValuePointer(ID, game) {
        this.ID = ID;
        this.game = game;
    }
    return ValuePointer;
}());
exports.ValuePointer = ValuePointer;
