"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordingStatus = void 0;
const vscode_1 = require("vscode");
const sleep_1 = require("./sleep");
function clean(x) {
    let res = `${Math.trunc(x)}`;
    if (res.length < 2) {
        res = `0${res}`;
    }
    return res;
}
const SECOND_MS = 1000;
const MINUTE_MS = SECOND_MS * 60;
const HOUR_MS = MINUTE_MS * 60;
class RecordingStatus {
    constructor() {
        this.counting = false;
        this.item = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Right);
        this.stop();
        this.item.show();
    }
    show() {
        this.item.show();
    }
    dispose() {
        this.recordingStopped();
        this.item.dispose();
    }
    stop() {
        this.recordingStopped();
        this.item.command = "stories.startTextRecording";
        this.item.text = "$(debug-start) Record Story (beta)";
        this.counting = false;
    }
    stopping() {
        this.recordingStopped();
        this.item.text = "Recording stopping...";
        this.counting = false;
    }
    recordingStopped() {
        if (this.timeout) {
            clearInterval(this.timeout);
        }
    }
    updateTime(originalText, start) {
        const time = Date.now() - start;
        let timeStr = `${clean((time / MINUTE_MS) % 60)}:${clean((time / SECOND_MS) % 60)}`;
        if (time > HOUR_MS) {
            timeStr = `${Math.trunc(time / HOUR_MS)}:${timeStr}`;
        }
        this.item.text = `${originalText}: ${timeStr}`;
    }
    start() {
        this.item.command = "stories.stopTextRecording";
        this.item.text = "$(debug-stop) Recording";
        const update = this.updateTime.bind(this, this.item.text, Date.now());
        this.timeout = setInterval(update, 1000);
        update();
    }
    countDown(seconds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (seconds === undefined) {
                seconds = 3;
            }
            this.item.command = "stories.stopTextRecording";
            this.counting = true;
            for (let i = seconds; i > 0; i -= 1) {
                this.item.text = `$(debug-breakpoint-log-unverified) Starting in ${i} seconds...`;
                yield sleep_1.sleep(1000);
                if (!this.counting) {
                    throw new Error("Countdown canceled");
                }
            }
            this.counting = false;
            this.item.text = "Recording starting";
        });
    }
}
exports.RecordingStatus = RecordingStatus;
//# sourceMappingURL=status.js.map