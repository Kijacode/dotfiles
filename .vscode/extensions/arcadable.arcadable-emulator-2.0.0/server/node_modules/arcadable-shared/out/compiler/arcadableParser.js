"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParsedFile = exports.ArcadableParser = void 0;
const parseFunctions_1 = require("./parseFunctions");
class ArcadableParser {
    constructor() {
        this.tempContent = '';
        this.parsed = new ParsedFile();
    }
    parse(fileName, lines) {
        const lineCount = lines.length;
        this.parsed.filePath = fileName;
        const functionParseResults = [];
        const valueParseResults = [];
        for (let lineNumber = 0; lineNumber < lineCount;) {
            const line = lines[lineNumber];
            const codeLine = line.split(/\/\//g)[0];
            const sections = codeLine.split(/;/g);
            let totalPosition = 0;
            let parsedLinesCount = 1;
            sections.forEach((section) => {
                section += 'END_OF_SECTION';
                let position = 0;
                let char = section.charAt(position);
                while (char.match(/\s/g)) {
                    position++;
                    char = section.charAt(position);
                }
                const importMatch = section.substr(position).match(/^import/g);
                const otherMatch = section.substr(position).match(/^([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*:/g);
                if (importMatch) {
                    const importParseResult = parseFunctions_1.ParseImport(section.substr(position));
                    if (importParseResult.import && importParseResult.import.length > 0) {
                        this.parsed.imports.push(importParseResult.import);
                    }
                    if (importParseResult.errors && importParseResult.errors.length > 0) {
                        this.parsed.errors.push(...importParseResult.errors.map(e => ({
                            file: fileName,
                            line: lineNumber + 1,
                            pos: position + totalPosition + e.pos,
                            error: e.error
                        })));
                    }
                }
                else if (otherMatch) {
                    const otherMatchWithType = section.substr(position).match(/^([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*( *):( *)(Number|Analog|Speaker|Image|Data|Digital|Pixel|Config|String|Eval|AsyncFunction|Function|ListValue|List<( *)(Number|Analog|Speaker|Image|Data|Digital|Pixel|Config|String|Eval)( *)>)/g);
                    if (otherMatchWithType) {
                        const values = otherMatchWithType[0].replace(/\s/g, '').split(':');
                        const type = values[1];
                        switch (type) {
                            case 'Number': {
                                valueParseResults.push({
                                    parseResult: parseFunctions_1.ParseValueNumber(section.substr(position), otherMatchWithType),
                                    line: lineNumber + 1,
                                    pos: position + totalPosition,
                                    file: fileName
                                });
                                break;
                            }
                            case 'Analog': {
                                valueParseResults.push({
                                    parseResult: parseFunctions_1.ParseValueAnalog(section.substr(position), otherMatchWithType),
                                    line: lineNumber + 1,
                                    pos: position + totalPosition,
                                    file: fileName
                                });
                                break;
                            }
                            case 'Digital': {
                                valueParseResults.push({
                                    parseResult: parseFunctions_1.ParseValueDigital(section.substr(position), otherMatchWithType),
                                    line: lineNumber + 1,
                                    pos: position + totalPosition,
                                    file: fileName
                                });
                                break;
                            }
                            case 'Speaker': {
                                valueParseResults.push({
                                    parseResult: parseFunctions_1.ParseValueSpeaker(section.substr(position), otherMatchWithType),
                                    line: lineNumber + 1,
                                    pos: position + totalPosition,
                                    file: fileName
                                });
                                break;
                            }
                            case 'Data': {
                                valueParseResults.push({
                                    parseResult: parseFunctions_1.ParseValueData(section.substr(position), otherMatchWithType),
                                    line: lineNumber + 1,
                                    pos: position + totalPosition,
                                    file: fileName
                                });
                                break;
                            }
                            case 'Image': {
                                valueParseResults.push(...parseFunctions_1.ParseValueImage(section.substr(position), otherMatchWithType).map(r => ({
                                    parseResult: {
                                        value: r.value,
                                        errors: r.errors
                                    },
                                    line: lineNumber + 1,
                                    pos: position + totalPosition,
                                    file: fileName
                                })));
                                break;
                            }
                            case 'Pixel': {
                                valueParseResults.push(...parseFunctions_1.ParseValuePixel(section.substr(position), otherMatchWithType).map(r => ({
                                    parseResult: {
                                        value: r.value,
                                        errors: r.errors
                                    },
                                    line: lineNumber + 1,
                                    pos: position + totalPosition,
                                    file: fileName
                                })));
                                break;
                            }
                            case 'Config': {
                                valueParseResults.push({
                                    parseResult: parseFunctions_1.ParseValueConfig(section.substr(position), otherMatchWithType),
                                    line: lineNumber + 1,
                                    pos: position + totalPosition,
                                    file: fileName
                                });
                                break;
                            }
                            case 'String': {
                                valueParseResults.push(...parseFunctions_1.ParseValueString(section.substr(position), otherMatchWithType).map(r => ({
                                    parseResult: {
                                        value: r.value,
                                        errors: r.errors
                                    },
                                    line: lineNumber + 1,
                                    pos: position + totalPosition,
                                    file: fileName
                                })));
                                break;
                            }
                            case 'Eval': {
                                valueParseResults.push(...parseFunctions_1.ParseValueEval(section.substr(position), otherMatchWithType).map(r => ({
                                    parseResult: {
                                        value: r.value,
                                        errors: r.errors
                                    },
                                    line: lineNumber + 1,
                                    pos: position + totalPosition,
                                    file: fileName
                                })));
                                break;
                            }
                            case 'AsyncFunction': {
                                const res = parseFunctions_1.GetParseFunctionExecutable(section.substr(position), otherMatchWithType, lineNumber, lines, true);
                                functionParseResults.push(res);
                                parsedLinesCount = res.parsedCount;
                                break;
                            }
                            case 'Function': {
                                const res = parseFunctions_1.GetParseFunctionExecutable(section.substr(position), otherMatchWithType, lineNumber, lines);
                                functionParseResults.push(res);
                                parsedLinesCount = res.parsedCount;
                                break;
                            }
                            case 'ListValue': {
                                valueParseResults.push(...parseFunctions_1.ParseValueListValue(section.substr(position), otherMatchWithType).map(r => ({
                                    parseResult: {
                                        value: r.value,
                                        errors: r.errors
                                    },
                                    line: lineNumber + 1,
                                    pos: position + totalPosition,
                                    file: fileName
                                })));
                                break;
                            }
                            case 'List<Number>': {
                                valueParseResults.push(...parseFunctions_1.ParseValueListNumber(section.substr(position), otherMatchWithType).map(r => ({
                                    parseResult: {
                                        value: r.value,
                                        errors: r.errors
                                    },
                                    line: lineNumber + 1,
                                    pos: position + totalPosition,
                                    file: fileName
                                })));
                                break;
                            }
                            case 'List<Analog>': {
                                valueParseResults.push(...parseFunctions_1.ParseValueListAnalog(section.substr(position), otherMatchWithType).map(r => ({
                                    parseResult: {
                                        value: r.value,
                                        errors: r.errors
                                    },
                                    line: lineNumber + 1,
                                    pos: position + totalPosition,
                                    file: fileName
                                })));
                                break;
                            }
                            case 'List<Digital>': {
                                valueParseResults.push(...parseFunctions_1.ParseValueListDigital(section.substr(position), otherMatchWithType).map(r => ({
                                    parseResult: {
                                        value: r.value,
                                        errors: r.errors
                                    },
                                    line: lineNumber + 1,
                                    pos: position + totalPosition,
                                    file: fileName
                                })));
                                break;
                            }
                            case 'List<Pixel>': {
                                valueParseResults.push(...parseFunctions_1.ParseValueListPixel(section.substr(position), otherMatchWithType).map(r => ({
                                    parseResult: {
                                        value: r.value,
                                        errors: r.errors
                                    },
                                    line: lineNumber + 1,
                                    pos: position + totalPosition,
                                    file: fileName
                                })));
                                break;
                            }
                            case 'List<Config>': {
                                valueParseResults.push(...parseFunctions_1.ParseValueListConfig(section.substr(position), otherMatchWithType).map(r => ({
                                    parseResult: {
                                        value: r.value,
                                        errors: r.errors
                                    },
                                    line: lineNumber + 1,
                                    pos: position + totalPosition,
                                    file: fileName
                                })));
                                break;
                            }
                            case 'List<String>': {
                                valueParseResults.push(...parseFunctions_1.ParseValueListString(section.substr(position), otherMatchWithType).map(r => ({
                                    parseResult: {
                                        value: r.value,
                                        errors: r.errors
                                    },
                                    line: lineNumber + 1,
                                    pos: position + totalPosition,
                                    file: fileName
                                })));
                                break;
                            }
                            case 'List<Eval>': {
                                valueParseResults.push(...parseFunctions_1.ParseValueListEval(section.substr(position), otherMatchWithType).map(r => ({
                                    parseResult: {
                                        value: r.value,
                                        errors: r.errors
                                    },
                                    line: lineNumber + 1,
                                    pos: position + totalPosition,
                                    file: fileName
                                })));
                                break;
                            }
                            /*case 'List<Image>': { todo
                                valueParseResults.push(...ParseValueListImage(section.substr(position), otherMatchWithType).map(r => ({
                                    parseResult: {
                                        value: r.value,
                                        errors: r.errors
                                    },
                                    line: lineNumber + 1,
                                    pos: position + totalPosition,
                                    file: fileName
                                })));
                                break;
                            }
                            case 'List<Data>': {
                                valueParseResults.push(...ParseValueListData(section.substr(position), otherMatchWithType).map(r => ({
                                    parseResult: {
                                        value: r.value,
                                        errors: r.errors
                                    },
                                    line: lineNumber + 1,
                                    pos: position + totalPosition,
                                    file: fileName
                                })));
                                break;
                            }
                            case 'List<Speaker>': {
                                valueParseResults.push(...ParseValueListSpeaker(section.substr(position), otherMatchWithType).map(r => ({
                                    parseResult: {
                                        value: r.value,
                                        errors: r.errors
                                    },
                                    line: lineNumber + 1,
                                    pos: position + totalPosition,
                                    file: fileName
                                })));
                                break;
                            }*/
                        }
                    }
                    else {
                        this.parsed.errors.push({
                            file: fileName,
                            line: lineNumber + 1,
                            pos: position + totalPosition,
                            error: 'Unexpected type'
                        });
                    }
                }
                else {
                    let s = section.substr(position).replace('END_OF_SECTION', '');
                    if (s.length > 0) {
                        if (s.length > 20) {
                            s = s.substr(0, 17) + '...';
                        }
                        this.parsed.errors.push({
                            file: fileName,
                            line: lineNumber + 1,
                            pos: position + totalPosition,
                            error: `Unexpected token "${s}"`
                        });
                    }
                }
                totalPosition += section.replace('END_OF_SECTION', '').length + 1;
            });
            lineNumber += parsedLinesCount;
        }
        functionParseResults.forEach(functionParseResult => {
            this.parsed.errors.push(...functionParseResult.errors
                .map(e => ({
                file: fileName,
                line: e.line,
                pos: e.pos,
                error: e.error
            })));
        });
        this.parsed.errors.push(...valueParseResults
            .filter(v => !!v.parseResult)
            .reduce((acc, curr) => [
            ...acc,
            ...curr.parseResult.errors.map(e => ({
                file: curr.file,
                line: curr.line,
                pos: e.pos,
                error: e.error
            }))
        ], []));
        this.parsed.functionParseResults = functionParseResults.map(f => f.functionParseExecutable);
        this.parsed.valueParseResults = valueParseResults;
        return this.parsed;
    }
}
exports.ArcadableParser = ArcadableParser;
class ParsedFile {
    constructor() {
        this.filePath = '';
        this.imports = [];
        this.valueParseResults = [];
        this.functionParseResults = [];
        this.errors = [];
    }
}
exports.ParsedFile = ParsedFile;
//# sourceMappingURL=arcadableParser.js.map