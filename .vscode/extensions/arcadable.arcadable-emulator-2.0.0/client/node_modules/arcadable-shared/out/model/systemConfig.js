"use strict";
exports.__esModule = true;
exports.SystemConfig = exports.systemConfigTypes = exports.SystemConfigType = void 0;
var SystemConfigType;
(function (SystemConfigType) {
    SystemConfigType[SystemConfigType["screenWidth"] = 0] = "screenWidth";
    SystemConfigType[SystemConfigType["screenHeight"] = 1] = "screenHeight";
    SystemConfigType[SystemConfigType["currentMillis"] = 2] = "currentMillis";
    SystemConfigType[SystemConfigType["isZigZag"] = 3] = "isZigZag";
})(SystemConfigType = exports.SystemConfigType || (exports.SystemConfigType = {}));
exports.systemConfigTypes = Object.keys(SystemConfigType).filter(function (key) { return isNaN(Number(SystemConfigType[key])); }).map(function (value) {
    switch (Number(value)) {
        case SystemConfigType.screenWidth:
            return { viewValue: 'Screen width', value: Number(value) };
        case SystemConfigType.screenHeight:
            return { viewValue: 'Screen height', value: Number(value) };
        case SystemConfigType.currentMillis:
            return { viewValue: 'Current millis', value: Number(value) };
        case SystemConfigType.isZigZag:
            return { viewValue: 'Is zig zag', value: Number(value) };
        default:
            return { viewValue: '', value: 0 };
    }
});
var SystemConfig = /** @class */ (function () {
    function SystemConfig(screenWidth, screenHeight, targetMainMillis, targetRenderMillis, layoutIsZigZag, digitalInputPinsAmount, analogInputPinsAmount, speakerOutputAmount, startMillis) {
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        this.targetMainMillis = targetMainMillis;
        this.targetRenderMillis = targetRenderMillis;
        this.layoutIsZigZag = layoutIsZigZag;
        this.digitalInputPinsAmount = digitalInputPinsAmount;
        this.analogInputPinsAmount = analogInputPinsAmount;
        this.speakerOutputAmount = speakerOutputAmount;
        this.startMillis = startMillis;
        this.digitalInputValues = [];
        this.realTimeDigitalInputValues = {};
        this.analogInputValues = [];
        this.realTimeAnalogInputValues = {};
        for (var i = 0; i < this.digitalInputPinsAmount; i++) {
            this.realTimeDigitalInputValues[i] = 0;
        }
        for (var i = 0; i < this.analogInputPinsAmount; i++) {
            this.realTimeAnalogInputValues[i] = 512;
        }
        this.digitalInputValues = this.digitalInputValues.fill(0);
        this.analogInputValues = this.analogInputValues.fill(512);
    }
    SystemConfig.prototype.get = function (type) {
        switch (type) {
            case SystemConfigType.screenWidth: {
                return this.screenWidth;
            }
            case SystemConfigType.screenHeight: {
                return this.screenHeight;
            }
            case SystemConfigType.currentMillis: {
                return new Date().getTime() - this.startMillis;
            }
            case SystemConfigType.isZigZag: {
                return this.layoutIsZigZag ? 1 : 0;
            }
        }
    };
    SystemConfig.prototype.fetchInputValues = function () {
        for (var i = 0; i < this.digitalInputPinsAmount; i++) {
            this.digitalInputValues[i] = this.digitalRead(i);
        }
        for (var i = 0; i < this.analogInputPinsAmount; i++) {
            this.analogInputValues[i] = this.analogRead(i);
        }
    };
    SystemConfig.prototype.digitalRead = function (input) {
        return this.realTimeDigitalInputValues[input];
    };
    SystemConfig.prototype.analogRead = function (input) {
        return this.realTimeAnalogInputValues[input];
    };
    SystemConfig.prototype.stringify = function () {
        return JSON.stringify({
            screenWidth: this.screenWidth,
            screenHeight: this.screenHeight,
            targetMainMillis: this.targetMainMillis,
            targetRenderMillis: this.targetRenderMillis,
            layoutIsZigZag: this.layoutIsZigZag,
            digitalInputPinsAmount: this.digitalInputPinsAmount,
            analogInputPinsAmount: this.analogInputPinsAmount
        });
    };
    return SystemConfig;
}());
exports.SystemConfig = SystemConfig;
