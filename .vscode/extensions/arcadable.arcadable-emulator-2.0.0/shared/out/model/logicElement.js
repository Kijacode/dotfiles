"use strict";
exports.__esModule = true;
exports.LogicElement = void 0;
var LogicElement = /** @class */ (function () {
    function LogicElement(ID, name, game) {
        this.ID = ID;
        this.name = name;
        this.game = game;
    }
    LogicElement.prototype.getName = function () {
        if (this.name !== undefined && this.name.length !== 0) {
            return this.name;
        }
        else {
            return this.ID;
        }
    };
    return LogicElement;
}());
exports.LogicElement = LogicElement;
