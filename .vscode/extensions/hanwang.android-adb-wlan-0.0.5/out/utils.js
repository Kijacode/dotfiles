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
const execa_1 = require("execa");
const vscode = require("vscode");
const delay = require("delay");
const os = require("os");
const net_1 = require("net");
const ipUtil = require("ip");
class Utils {
    constructor() {
        this.port = "1031";
        // private usedPorts: Set<string> = new Set();
        /**
         * Parses devices
         * @param stdout
         * @returns devices
         */
        this.parseDevices = (stdout) => {
            const arr = stdout.split(/\s+/g);
            // // 顺便添加已连接的ip端口 到 usedPorts
            // if (this.isIp(arr[3])) {
            //   const port = arr[3]?.split(':')[1]?.trim();
            //   if (!!port) { this.usedPorts.add(port); }
            // }
            return { device: arr[0], model: arr[3] };
        };
        this.getSeeminglyLanAddress = () => {
            const seemsIps = [];
            const bIp = [];
            const valid = {};
            // ip rfc
            for (let index = 16; index < 32; index++) {
                bIp.push(`172.${index}.0.0/16`);
            }
            const normalInternalIps = ['10.0.0.0/0', '192.168.0.0/16'].concat(bIp).map((val) => ipUtil.cidrSubnet(val));
            const netInterfaces = os.networkInterfaces();
            for (const adapter of Object.values(netInterfaces)) {
                for (const instance of adapter) {
                    if (!instance.internal && net_1.isIPv4(instance.address)) {
                        seemsIps.push(instance.address);
                    }
                }
            }
            valid.allIpv4 = seemsIps;
            for (const ip of seemsIps) {
                normalInternalIps.forEach((val) => {
                    val.contains(ip) && (valid.seemsIp = ip);
                });
            }
            return valid;
        };
    }
    isObject(target) {
        return Object.prototype.toString.call(target) === '[object Object]';
    }
    getAllIpsRec(netInter, saver) {
        for (const key in netInter) {
            const current = netInter[key];
            if (Array.isArray(current)) {
                for (let index = 0; index < current.length; index++) {
                    if (this.isObject(current[index])) {
                        saver.push(current[index]['address']);
                        this.getAllIpsRec(current[index], saver);
                    }
                }
            }
            else if (this.isObject(current)) {
                this.getAllIpsRec(current, saver);
            }
        }
    }
    isIp(ip) {
        return /^(.*)((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)(:(\d+))?$/.test(ip);
    }
    getIpsHeader() {
        const netInter = os.networkInterfaces();
        const ips = [];
        this.getAllIpsRec(netInter, ips);
        return ips.map((val) => { var _a; return (_a = val.match(/(.+)(?<=\.)/g)) === null || _a === void 0 ? void 0 : _a.pop(); });
    }
    parseAddress(stdout) {
        var _a;
        return (_a = stdout
            .match(/(?<=inet\s+)(((\d+)\.)+(\d+))\/\d+/g)) === null || _a === void 0 ? void 0 : _a.map((val) => val.trim());
    }
    checkAdbExist(unExist) {
        try {
            const result = execa_1.commandSync("adb --version");
            console.log(result.stderr);
            console.log(result.stdout);
            return true;
        }
        catch (e) {
            unExist(e);
            return false;
        }
    }
    checkDevices() {
        const output = execa_1.commandSync(`adb devices -l`).stdout;
        const allLines = output
            .split(/\n|\r\n/)
            .slice(1)
            .filter(val => val !== "");
        if (allLines.length === 0) {
            return [];
        }
        return allLines.map(this.parseDevices);
    }
    // public clearPorts = () => {
    //   this.usedPorts.clear();
    // };
    setTcpIpWithDevice(p, device) {
        return __awaiter(this, void 0, void 0, function* () {
            // if (this.usedPorts.has(p)) {
            //   vscode.window.showErrorMessage(`${p} has been used`);
            //   return false;
            // }
            this.port = p;
            console.debug(`adb -s ${device} tcpip ${this.port}`);
            try {
                yield execa_1.command(`adb -s ${device} tcpip ${this.port}`);
            }
            catch (error) {
                vscode.window.showErrorMessage(error);
                return false;
            }
            return true;
        });
    }
    getDeviceAddress(device) {
        var _a, _b;
        console.debug(`adb -s ${device} shell ip -o -4 addr`);
        const output = execa_1.commandSync(`adb -s ${device} shell ip -o -4 addr`).stdout;
        const ips = this.getSeeminglyLanAddress();
        return (_b = (_a = this.parseAddress(output)) === null || _a === void 0 ? void 0 : _a.map((val) => ipUtil.cidrSubnet(val).contains(ips.seemsIp) ? val === null || val === void 0 ? void 0 : val.replace(/\/(\d+)$/, '') : false)) === null || _b === void 0 ? void 0 : _b.filter(Boolean);
    }
    connect(ip, name) {
        console.debug(`adb -s ${name} connect ${ip}:${this.port}`);
        return execa_1.command(`adb -s ${name} connect ${ip}:${this.port}`);
    }
    restartServer() {
        return __awaiter(this, void 0, void 0, function* () {
            yield execa_1.command("adb kill-server");
            yield delay(800);
            yield execa_1.command("adb start-server");
        });
    }
}
exports.default = Utils;
//# sourceMappingURL=utils.js.map