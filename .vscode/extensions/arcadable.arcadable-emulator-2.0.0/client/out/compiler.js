"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompileResult = exports.ParsedProgram = exports.ArcadableCompiler = void 0;
const vscode = require("vscode");
const arcadable_shared_1 = require("arcadable-shared");
const valueArrayValueType_1 = require("arcadable-shared/out/model/values/valueArrayValueType");
const imageValueType_1 = require("arcadable-shared/out/model/values/imageValueType");
class ArcadableCompiler {
    constructor(config, docs) {
        this.config = config;
        this.docs = docs;
        this.tempContent = '';
        this.compileResult = new CompileResult(this.config);
    }
    async startCompile() {
        this.tempContent = '';
        this.compileResult = new CompileResult(this.config);
        const parseResult = {};
        const mainDoc = this.docs[this.docs['root'] + this.docs['main']];
        parseResult[mainDoc.uri.path] = new arcadable_shared_1.ArcadableParser().parse(mainDoc.uri.path, mainDoc.getText().split(/\n/g));
        let imports = {};
        if (parseResult[mainDoc.uri.path].imports && parseResult[mainDoc.uri.path].imports.length > 0) {
            imports = parseResult[mainDoc.uri.path].imports.reduce((acc, curr, i) => ({ ...acc, [parseResult[mainDoc.uri.path].filePath + '////' + i]: curr }), {});
        }
        while (Object.keys(imports).length > 0) {
            const currentKey = Object.keys(imports)[0];
            const fullBasePath = currentKey.replace(/\/\/\/\/.*/g, '');
            const baseName = fullBasePath.match(/[^\/]*?\.arc/g)[0];
            const baseDir = fullBasePath.replace(baseName, '');
            let importPath = baseDir + imports[currentKey];
            let backMatch = importPath.match(/[^\/]*?\/\.\.\//g);
            while (backMatch) {
                importPath = importPath.replace(/[^\/]*?\/\.\.\//g, '');
                backMatch = importPath.match(/[^\/]*?\/\.\.\//g);
            }
            if (parseResult[importPath] === undefined) {
                const importDoc = this.docs[importPath];
                if (importDoc) {
                    parseResult[importPath] = new arcadable_shared_1.ArcadableParser().parse(importDoc.uri.path, importDoc.getText().split(/\n/g));
                    if (parseResult[importPath].imports && parseResult[importPath].imports.length > 0) {
                        imports = parseResult[importPath].imports.reduce((acc, curr, i) => ({ ...acc, [parseResult[importPath].filePath + '////' + i]: curr }), imports);
                    }
                }
                else {
                    parseResult[fullBasePath].errors.push({
                        file: fullBasePath,
                        line: 0,
                        pos: 0,
                        error: 'Cannot find import file: "' + importPath + '"'
                    });
                }
            }
            delete imports[currentKey];
        }
        const parseErrors = Object.keys(parseResult).reduce((acc, curr) => [...acc, ...parseResult[curr].errors], []);
        this.compileResult.parseErrors = parseErrors;
        if (parseErrors.length === 0) {
            Object.keys(parseResult);
            const parsedProgram = new ParsedProgram();
            await parsedProgram.init(parseResult);
            this.compileResult.compileErrors.push(...parsedProgram.compileErrors);
            if (this.compileResult.compileErrors.length === 0) {
                const gameData = this.checkAndMerge(parsedProgram);
                this.compileResult.compileErrors = gameData.compileErrors;
                if (this.compileResult.compileErrors.length === 0) {
                    const setupInstructionSet = gameData.compressedInstructionSets.findIndex(is => is.linked.findIndex(l => l.name.toLowerCase() === 'setup') !== -1);
                    const mainInstructionSet = gameData.compressedInstructionSets.findIndex(is => is.linked.findIndex(l => l.name.toLowerCase() === 'main') !== -1);
                    const renderInstructionSet = gameData.compressedInstructionSets.findIndex(is => is.linked.findIndex(l => l.name.toLowerCase() === 'render') !== -1);
                    if (setupInstructionSet === -1) {
                        this.compileResult.compileErrors.push({
                            file: '',
                            line: 0,
                            pos: 0,
                            error: 'Cannot find "Setup" function'
                        });
                    }
                    else if (gameData.compressedInstructionSets[setupInstructionSet].async) {
                        this.compileResult.compileErrors.push({
                            file: '',
                            line: 0,
                            pos: 0,
                            error: 'Setup function cannot be asynchronous'
                        });
                    }
                    if (mainInstructionSet === -1) {
                        this.compileResult.compileErrors.push({
                            file: '',
                            line: 0,
                            pos: 0,
                            error: 'Cannot find "Main" function'
                        });
                    }
                    else if (gameData.compressedInstructionSets[mainInstructionSet].async) {
                        this.compileResult.compileErrors.push({
                            file: '',
                            line: 0,
                            pos: 0,
                            error: 'Main function cannot be asynchronous'
                        });
                    }
                    if (renderInstructionSet === -1) {
                        this.compileResult.compileErrors.push({
                            file: '',
                            line: 0,
                            pos: 0,
                            error: 'Cannot find "Render" function'
                        });
                    }
                    else if (gameData.compressedInstructionSets[renderInstructionSet].async) {
                        this.compileResult.compileErrors.push({
                            file: '',
                            line: 0,
                            pos: 0,
                            error: 'Render function cannot be asynchronous'
                        });
                    }
                    if (setupInstructionSet !== -1 && mainInstructionSet !== -1 && renderInstructionSet !== -1) {
                        this.compileResult.assignGameData(gameData);
                    }
                }
            }
        }
        return this.compileResult;
    }
    checkAndMerge(parsedProgram) {
        parsedProgram = this.checkForReferenceProblems(parsedProgram);
        if (parsedProgram.compileErrors.length === 0) {
            parsedProgram = this.compress(parsedProgram);
        }
        return parsedProgram;
    }
    compress(data) {
        let compressedValues = [];
        data.values.forEach((v, index) => {
            let valueIndex = -1;
            let mutatable = false;
            if (v.type === arcadable_shared_1.ValueType.number && (v.value + '').charAt(0) === '.') {
                v.value = '0' + v.value;
            }
            else if (v.type === arcadable_shared_1.ValueType.number) {
                v.value = '' + v.value;
            }
            let watchForNames = [v.name];
            const listsContainingValue = data.values.filter(v2 => (v2.type === arcadable_shared_1.ValueType.listDeclaration || v2.type === arcadable_shared_1.ValueType.text) &&
                v2.value.values.findIndex(listValue => listValue === v.name) !== -1);
            const listsContainingValuePointers = data.values.filter(v => v.type === arcadable_shared_1.ValueType.listValue &&
                listsContainingValue.findIndex(list => list.name === v.value.list) !== -1);
            if (listsContainingValuePointers.length > 0) {
                watchForNames = [...watchForNames, ...listsContainingValuePointers.map(p => p.name)];
            }
            if (data.instructionSets.findIndex(is => is.instructions.findIndex(i => i.type === arcadable_shared_1.InstructionType.MutateValue && watchForNames.findIndex(n => n === i.params[0]) !== -1) !== -1) === -1) {
                valueIndex = compressedValues.findIndex(vc => !vc.mutatable && vc.type === v.type && JSON.stringify(vc.value) === JSON.stringify(v.value));
            }
            else {
                mutatable = true;
            }
            if (valueIndex === -1) {
                valueIndex = compressedValues.push({
                    type: v.type,
                    value: v.value,
                    mutatable,
                    linked: []
                }) - 1;
            }
            data.values[index].compressedIndex = valueIndex;
            compressedValues[valueIndex].linked.push(v);
        });
        let compressedInstructions = [];
        let compressedInstructionSets = [];
        data.instructionSets.forEach((is, index) => {
            const instructions = [];
            is.instructions.forEach((i, index2) => {
                let instructionIndex = compressedInstructions.findIndex(ic => ic.type === i.type &&
                    JSON.stringify(ic.params) === JSON.stringify(i.params) &&
                    ic.await === i.await);
                if (instructionIndex === -1) {
                    instructionIndex = compressedInstructions.push({
                        type: i.type,
                        params: i.params,
                        await: i.await,
                        linked: []
                    }) - 1;
                }
                data.instructionSets[index].instructions[index2].compressedIndex = instructionIndex;
                compressedInstructions[instructionIndex].linked.push(i);
                instructions.push(instructionIndex);
            });
            let instructionSetIndex = compressedInstructionSets.findIndex(isc => {
                if (isc.instructions === instructions && isc.async === is.async)
                    return true;
                if (isc.instructions == null || instructions == null)
                    return false;
                if (isc.instructions.length != instructions.length)
                    return false;
                for (var i = 0; i < isc.instructions.length; ++i) {
                    if (isc.instructions[i] !== instructions[i])
                        return false;
                }
                if (isc.async !== is.async)
                    return false;
                return true;
            });
            if (instructionSetIndex === -1) {
                instructionSetIndex = compressedInstructionSets.push({
                    instructions,
                    async: is.async,
                    linked: []
                }) - 1;
            }
            data.instructionSets[index].compressedIndex = instructionSetIndex;
            compressedInstructionSets[instructionSetIndex].linked.push(is);
        });
        let optimized = true;
        let optimizationLoops = 0;
        while (optimized && optimizationLoops < 100) {
            optimizationLoops++;
            optimized = false;
            compressedInstructionSets.forEach((is, setIndex) => {
                compressedInstructions.forEach((i) => {
                    if (i.type === arcadable_shared_1.InstructionType.RunSet && isNaN(+i.params[0]) && is.linked.findIndex(l => l.name === i.params[0]) !== -1) {
                        i.params[0] = setIndex.toString();
                        optimized = true;
                    }
                    if (i.type === arcadable_shared_1.InstructionType.RunCondition) {
                        if (isNaN(+i.params[1]) && is.linked.findIndex(l => l.name === i.params[1]) !== -1) {
                            i.params[1] = setIndex.toString();
                            optimized = true;
                        }
                        if (isNaN(+i.params[2]) && is.linked.findIndex(l => l.name === i.params[2]) !== -1) {
                            i.params[2] = setIndex.toString();
                            optimized = true;
                        }
                    }
                });
            });
            compressedValues.forEach((v, valueIndex) => {
                compressedInstructions.filter(i => i.type !== arcadable_shared_1.InstructionType.RunSet).forEach(i => {
                    const paramIndexes = i.params.reduce((acc, curr, index) => (isNaN(+curr) && v.linked.findIndex(l => l.name === curr) !== -1) ? [...acc, index] : acc, []);
                    paramIndexes.filter(p => i.type !== arcadable_shared_1.InstructionType.RunCondition || p === 0).forEach(p => {
                        i.params[p] = valueIndex.toString();
                        optimized = true;
                    });
                });
                compressedValues.forEach((v2, value2Index) => {
                    if (value2Index !== valueIndex) {
                        switch (v2.type) {
                            case arcadable_shared_1.ValueType.evaluation: {
                                if (isNaN(+v2.value.left) && v.linked.findIndex(l => l.name === v2.value.left) !== -1) {
                                    v2.value.left = valueIndex.toString();
                                    optimized = true;
                                }
                                if (isNaN(+v2.value.right) && v.linked.findIndex(l => l.name === v2.value.right) !== -1) {
                                    v2.value.right = valueIndex.toString();
                                    optimized = true;
                                }
                                break;
                            }
                            case arcadable_shared_1.ValueType.text:
                            case arcadable_shared_1.ValueType.listDeclaration: {
                                const listIndexes = v2.value.values.reduce((acc, curr, index) => (isNaN(+curr) && v.linked.findIndex(l => l.name === curr) !== -1) ? [...acc, index] : acc, []);
                                listIndexes.forEach(p => {
                                    v2.value.values[p] = valueIndex.toString();
                                    optimized = true;
                                });
                                break;
                            }
                            case arcadable_shared_1.ValueType.listValue: {
                                if (isNaN(+v2.value.list) && v.linked.findIndex(l => l.name === v2.value.list) !== -1) {
                                    v2.value.list = valueIndex.toString();
                                    optimized = true;
                                }
                                if (isNaN(+v2.value.index) && v.linked.findIndex(l => l.name === v2.value.index) !== -1) {
                                    v2.value.index = valueIndex.toString();
                                    optimized = true;
                                }
                                break;
                            }
                            case arcadable_shared_1.ValueType.pixelIndex: {
                                if (isNaN(+v2.value.x) && v.linked.findIndex(l => l.name === v2.value.x) !== -1) {
                                    v2.value.x = valueIndex.toString();
                                    optimized = true;
                                }
                                if (isNaN(+v2.value.y) && v.linked.findIndex(l => l.name === v2.value.y) !== -1) {
                                    v2.value.y = valueIndex.toString();
                                    optimized = true;
                                }
                                break;
                            }
                            case arcadable_shared_1.ValueType.image: {
                                if (isNaN(+v2.value.width) && v.linked.findIndex(l => l.name === v2.value.width) !== -1) {
                                    v2.value.width = valueIndex.toString();
                                    optimized = true;
                                }
                                if (isNaN(+v2.value.height) && v.linked.findIndex(l => l.name === v2.value.height) !== -1) {
                                    v2.value.height = valueIndex.toString();
                                    optimized = true;
                                }
                                if (isNaN(+v2.value.keyColor) && v.linked.findIndex(l => l.name === v2.value.keyColor) !== -1) {
                                    v2.value.keyColor = valueIndex.toString();
                                    optimized = true;
                                }
                                if (isNaN(+v2.value.data) && v.linked.findIndex(l => l.name === v2.value.data) !== -1) {
                                    v2.value.data = valueIndex.toString();
                                    optimized = true;
                                }
                                break;
                            }
                        }
                    }
                });
            });
            const indexChanges = {};
            compressedValues = compressedValues.reduce((acc, curr, oldIndex) => {
                const existingIndex = acc.findIndex(existing => !existing.mutatable &&
                    !curr.mutatable &&
                    existing.type === curr.type &&
                    JSON.stringify(existing.value) === JSON.stringify(curr.value));
                if (existingIndex !== -1) {
                    indexChanges[oldIndex] = existingIndex;
                    acc[existingIndex].linked.push(...curr.linked);
                }
                else if (oldIndex !== acc.length) {
                    indexChanges[oldIndex] = acc.length;
                }
                return existingIndex !== -1 ? acc : [...acc, curr];
            }, []);
            Object.keys(indexChanges).forEach(oldIndex => {
                const newIndex = indexChanges[oldIndex];
                compressedInstructions.filter(i => i.type !== arcadable_shared_1.InstructionType.RunSet).forEach((i) => {
                    const paramIndexes = i.params.reduce((acc, curr, index) => (!isNaN(+curr) && curr === oldIndex) ? [...acc, index] : acc, []);
                    paramIndexes.filter(p => i.type !== arcadable_shared_1.InstructionType.RunCondition || p === 0).forEach(p => {
                        i.params[p] = newIndex.toString();
                        optimized = true;
                    });
                });
                compressedValues.forEach((v, i) => {
                    switch (v.type) {
                        case arcadable_shared_1.ValueType.evaluation: {
                            if (!isNaN(+v.value.left) && v.value.left === oldIndex) {
                                v.value.left = newIndex.toString();
                                optimized = true;
                            }
                            if (!isNaN(+v.value.right) && v.value.right === oldIndex) {
                                v.value.right = newIndex.toString();
                                optimized = true;
                            }
                            break;
                        }
                        case arcadable_shared_1.ValueType.text:
                        case arcadable_shared_1.ValueType.listDeclaration: {
                            const listIndexes = v.value.values.reduce((acc, curr, index) => (!isNaN(+curr) && curr === oldIndex) ? [...acc, index] : acc, []);
                            listIndexes.forEach(p => {
                                v.value.values[p] = newIndex.toString();
                                optimized = true;
                            });
                            break;
                        }
                        case arcadable_shared_1.ValueType.listValue: {
                            if (!isNaN(+v.value.list) && v.value.list === oldIndex) {
                                v.value.list = newIndex.toString();
                                optimized = true;
                            }
                            if (!isNaN(+v.value.index) && v.value.index === oldIndex) {
                                v.value.index = newIndex.toString();
                                optimized = true;
                            }
                            break;
                        }
                        case arcadable_shared_1.ValueType.pixelIndex: {
                            if (!isNaN(+v.value.x) && v.value.x === oldIndex) {
                                v.value.x = newIndex.toString();
                                optimized = true;
                            }
                            if (!isNaN(+v.value.y) && v.value.y === oldIndex) {
                                v.value.y = newIndex.toString();
                                optimized = true;
                            }
                            break;
                        }
                        case arcadable_shared_1.ValueType.image: {
                            if (!isNaN(+v.value.width) && v.value.width === oldIndex) {
                                v.value.width = newIndex.toString();
                                optimized = true;
                            }
                            if (!isNaN(+v.value.height) && v.value.height === oldIndex) {
                                v.value.height = newIndex.toString();
                                optimized = true;
                            }
                            if (!isNaN(+v.value.keyColor) && v.value.keyColor === oldIndex) {
                                v.value.keyColor = newIndex.toString();
                                optimized = true;
                            }
                            if (!isNaN(+v.value.data) && v.value.data === oldIndex) {
                                v.value.data = newIndex.toString();
                                optimized = true;
                            }
                            break;
                        }
                    }
                });
            });
            const instrIndexChanges = {};
            compressedInstructions = compressedInstructions.reduce((acc, curr, oldIndex) => {
                const existingIndex = acc.findIndex(existing => existing.type === curr.type &&
                    JSON.stringify(existing.params) === JSON.stringify(curr.params) &&
                    existing.await === curr.await);
                if (existingIndex !== -1) {
                    instrIndexChanges[oldIndex] = existingIndex;
                    acc[existingIndex].linked.push(...curr.linked);
                }
                else if (oldIndex !== acc.length) {
                    instrIndexChanges[oldIndex] = acc.length;
                }
                return existingIndex !== -1 ? acc : [...acc, curr];
            }, []);
            Object.keys(instrIndexChanges).forEach(oldIndex => {
                const newIndex = instrIndexChanges[oldIndex];
                compressedInstructionSets.forEach(is => {
                    const instrIndexes = is.instructions.reduce((acc, curr, index) => (curr === +oldIndex) ? [...acc, index] : acc, []);
                    instrIndexes.forEach(p => {
                        is.instructions[p] = newIndex;
                        optimized = true;
                    });
                });
            });
            const instrSetIndexChanges = {};
            compressedInstructionSets = compressedInstructionSets.reduce((acc, curr, oldIndex) => {
                const existingIndex = acc.findIndex(existing => JSON.stringify(existing.instructions) === JSON.stringify(curr.instructions) &&
                    existing.async === curr.async);
                if (existingIndex !== -1) {
                    instrSetIndexChanges[oldIndex] = existingIndex;
                    acc[existingIndex].linked.push(...curr.linked);
                }
                else if (oldIndex !== acc.length) {
                    instrSetIndexChanges[oldIndex] = acc.length;
                }
                return existingIndex !== -1 ? acc : [...acc, curr];
            }, []);
            Object.keys(instrSetIndexChanges).forEach(oldIndex => {
                const newIndex = instrSetIndexChanges[oldIndex];
                compressedInstructions.forEach(i => {
                    if (i.type === arcadable_shared_1.InstructionType.RunSet && !isNaN(+i.params[0]) && i.params[0] === oldIndex) {
                        i.params[0] = newIndex.toString();
                        optimized = true;
                    }
                    if (i.type === arcadable_shared_1.InstructionType.RunCondition) {
                        if (!isNaN(+i.params[1]) && i.params[1] === oldIndex) {
                            i.params[1] = newIndex.toString();
                            optimized = true;
                        }
                        if (!isNaN(+i.params[2]) && i.params[2] === oldIndex) {
                            i.params[2] = newIndex.toString();
                            optimized = true;
                        }
                    }
                });
            });
        }
        data.compressedValues = compressedValues;
        data.compressedInstructions = compressedInstructions;
        data.compressedInstructionSets = compressedInstructionSets;
        return data;
    }
    checkForReferenceProblems(data) {
        data.values.forEach(v => {
            let count = 0;
            data.values.forEach(vv => {
                if (vv.name === v.name) {
                    count++;
                }
            });
            if (count > 1) {
                data.compileErrors.push({
                    file: v.file,
                    line: v.line,
                    pos: v.pos,
                    error: 'Value with identifier "' + v.name + '" is declared multiple times.'
                });
            }
            if (v.type === arcadable_shared_1.ValueType.listDeclaration || v.type === arcadable_shared_1.ValueType.text) {
                const value = v.value;
                value.values.forEach(v1 => {
                    const valueIndex = data.values.findIndex(v2 => v2.name === v1);
                    if (valueIndex === -1) {
                        data.compileErrors.push(this.referenceNotFoundError(v.file, v.line, v.pos, v1));
                    }
                    else if (data.values[valueIndex].type !== value.type) {
                        data.compileErrors.push({
                            file: v.file,
                            line: v.line,
                            pos: v.pos,
                            error: 'Type of value with identifier "' + v1 + '" does not match this list type.'
                        });
                    }
                });
            }
            else if (v.type === arcadable_shared_1.ValueType.pixelIndex) {
                const values = [v.value.x, v.value.y];
                data.compileErrors.push(...this.checkNumbericalReferences(values, data, v.file, v.line, v.pos));
            }
            else if (v.type === arcadable_shared_1.ValueType.image) {
                const values = [v.value.width, v.value.height, v.value.keyColor];
                data.compileErrors.push(...this.checkNumbericalReferences(values, data, v.file, v.line, v.pos));
                const dataValueIndex = data.values.findIndex(v2 => v2.name === v.value.data);
                if (dataValueIndex === -1) {
                    data.compileErrors.push(this.referenceNotFoundError(v.file, v.line, v.pos, v.value.data));
                }
                else if (data.values[dataValueIndex].type !== arcadable_shared_1.ValueType.data) {
                    data.compileErrors.push({
                        file: v.file,
                        line: v.line,
                        pos: v.pos,
                        error: 'Value "' + v.value.data + '" not of type "Data" cannot be used here.'
                    });
                }
            }
            else if (v.type === arcadable_shared_1.ValueType.evaluation) {
                const values = [v.value.left, v.value.right];
                data.compileErrors.push(...this.checkNumbericalReferences(values, data, v.file, v.line, v.pos));
            }
            else if (v.type === arcadable_shared_1.ValueType.listValue) {
                data.compileErrors.push(...this.checkNumbericalReferences([v.value.index], data, v.file, v.line, v.pos));
                const valueIndex = data.values.findIndex(v2 => v2.name === v.value.list);
                if (valueIndex === -1) {
                    data.compileErrors.push(this.referenceNotFoundError(v.file, v.line, v.pos, v.value.list));
                }
            }
        });
        data.instructionSets.forEach(i => {
            if (i.instructions.length > 0) {
                let count = 0;
                data.instructionSets.forEach(ii => {
                    if (ii.name === i.name) {
                        count++;
                    }
                });
                if (count > 1) {
                    data.compileErrors.push({
                        file: i.instructions[0].file,
                        line: i.instructions[0].line,
                        pos: 0,
                        error: 'Function with identifier "' + i.name + '" is declared multiple times.'
                    });
                }
                i.instructions.forEach(instruction => {
                    if (instruction.await &&
                        (instruction.type !== arcadable_shared_1.InstructionType.RunCondition &&
                            instruction.type !== arcadable_shared_1.InstructionType.RunSet &&
                            instruction.type !== arcadable_shared_1.InstructionType.Wait &&
                            instruction.type !== arcadable_shared_1.InstructionType.Tone)) {
                        data.compileErrors.push({
                            file: instruction.file,
                            line: instruction.line,
                            pos: instruction.pos,
                            error: 'Instruction type is not awaitable'
                        });
                    }
                    switch (instruction.type) {
                        case arcadable_shared_1.InstructionType.DrawCircle:
                        case arcadable_shared_1.InstructionType.DrawLine:
                        case arcadable_shared_1.InstructionType.DrawPixel:
                        case arcadable_shared_1.InstructionType.DrawRect:
                        case arcadable_shared_1.InstructionType.DrawTriangle:
                        case arcadable_shared_1.InstructionType.FillCircle:
                        case arcadable_shared_1.InstructionType.FillRect:
                        case arcadable_shared_1.InstructionType.FillTriangle:
                        case arcadable_shared_1.InstructionType.SetRotation: {
                            data.compileErrors.push(...this.checkNumbericalReferences(instruction.params, data, instruction.file, instruction.line, instruction.pos));
                            break;
                        }
                        case arcadable_shared_1.InstructionType.MutateValue: {
                            const valueIndex = data.values.findIndex(v2 => v2.name === instruction.params[0]);
                            if (valueIndex === -1) {
                                data.compileErrors.push(this.referenceNotFoundError(instruction.file, instruction.line, instruction.pos, instruction.params[0]));
                            }
                            else {
                                if (data.values[valueIndex].type === arcadable_shared_1.ValueType.text || data.values[valueIndex].type === arcadable_shared_1.ValueType.listDeclaration) {
                                    data.compileErrors.push(...this.checkListReferences([instruction.params[1]], data, instruction.file, instruction.line, instruction.pos));
                                }
                                else {
                                    data.compileErrors.push(...this.checkNumbericalReferences(instruction.params, data, instruction.file, instruction.line, instruction.pos));
                                }
                            }
                            break;
                        }
                        case arcadable_shared_1.InstructionType.RunCondition: {
                            data.compileErrors.push(...this.checkInstructionSetReferences([instruction.params[1], instruction.params[1]], instruction.await, data, instruction.file, instruction.line, instruction.pos));
                            if (instruction.await && !i.async) {
                                data.compileErrors.push({
                                    file: instruction.file,
                                    line: instruction.line,
                                    pos: instruction.pos,
                                    error: 'Cannot use await in block that is not asynchronous'
                                });
                            }
                            break;
                        }
                        case arcadable_shared_1.InstructionType.RunSet: {
                            data.compileErrors.push(...this.checkInstructionSetReferences(instruction.params, instruction.await, data, instruction.file, instruction.line, instruction.pos));
                            if (instruction.await && !i.async) {
                                data.compileErrors.push({
                                    file: instruction.file,
                                    line: instruction.line,
                                    pos: instruction.pos,
                                    error: 'Cannot use await in block that is not asynchronous'
                                });
                            }
                            break;
                        }
                        case arcadable_shared_1.InstructionType.DrawText: {
                            data.compileErrors.push(...this.checkNumbericalReferences(instruction.params.filter((p, i) => i !== 2), data, instruction.file, instruction.line, instruction.pos));
                            data.compileErrors.push(...this.checkListReferences([instruction.params[2]], data, instruction.file, instruction.line, instruction.pos));
                            break;
                        }
                        case arcadable_shared_1.InstructionType.DrawImage: {
                            data.compileErrors.push(...this.checkNumbericalReferences(instruction.params.filter((p, i) => i !== 2), data, instruction.file, instruction.line, instruction.pos));
                            data.compileErrors.push(...this.checkImageReferences([instruction.params[2]], data, instruction.file, instruction.line, instruction.pos));
                            break;
                        }
                        case arcadable_shared_1.InstructionType.Wait: {
                            data.compileErrors.push(...this.checkNumbericalReferences([instruction.params[0]], data, instruction.file, instruction.line, instruction.pos));
                            if (instruction.await && !i.async) {
                                data.compileErrors.push({
                                    file: instruction.file,
                                    line: instruction.line,
                                    pos: instruction.pos,
                                    error: 'Cannot use wait in block that is not asynchronous'
                                });
                            }
                        }
                        case arcadable_shared_1.InstructionType.DebugLog: {
                            const valueIndex = data.values.findIndex(v2 => v2.name === instruction.params[0]);
                            if (valueIndex === -1) {
                                data.compileErrors.push(this.referenceNotFoundError(instruction.file, instruction.line, instruction.pos, instruction.params[0]));
                            }
                            else if (data.values[valueIndex].type === arcadable_shared_1.ValueType.listDeclaration) {
                                data.compileErrors.push({
                                    file: instruction.file,
                                    line: instruction.line,
                                    pos: instruction.pos,
                                    error: 'Value "' + instruction.params[0] + '" with type "List" cannot be used here.'
                                });
                            }
                            break;
                        }
                        case arcadable_shared_1.InstructionType.Tone: {
                            data.compileErrors.push(...this.checkNumbericalReferences(instruction.params, data, instruction.file, instruction.line, instruction.pos));
                            if (instruction.await && !i.async) {
                                data.compileErrors.push({
                                    file: instruction.file,
                                    line: instruction.line,
                                    pos: instruction.pos,
                                    error: 'Cannot use await in block that is not asynchronous'
                                });
                            }
                            break;
                        }
                    }
                });
            }
        });
        return data;
    }
    checkNumbericalReferences(values, data, file, line, pos) {
        const errors = [];
        values.forEach(v1 => {
            const valueIndex = data.values.findIndex(v2 => v2.name === v1);
            if (valueIndex === -1) {
                errors.push(this.referenceNotFoundError(file, line, pos, v1));
            }
            else if (data.values[valueIndex].type === arcadable_shared_1.ValueType.listDeclaration ||
                data.values[valueIndex].type === arcadable_shared_1.ValueType.text ||
                data.values[valueIndex].type === arcadable_shared_1.ValueType.image ||
                data.values[valueIndex].type === arcadable_shared_1.ValueType.data) {
                errors.push({
                    file: file,
                    line: line,
                    pos: pos,
                    error: 'Value "' + v1 + '" with type "List", "String", "Image" or "Data" cannot be used here.'
                });
            }
        });
        return errors;
    }
    checkImageReferences(values, data, file, line, pos) {
        const errors = [];
        values.forEach(v1 => {
            const valueIndex = data.values.findIndex(v2 => v2.name === v1);
            if (valueIndex === -1) {
                errors.push(this.referenceNotFoundError(file, line, pos, v1));
            }
            else if (data.values[valueIndex].type !== arcadable_shared_1.ValueType.image) {
                errors.push({
                    file: file,
                    line: line,
                    pos: pos,
                    error: 'Value "' + v1 + '" not of type "Image" cannot be used here.'
                });
            }
        });
        return errors;
    }
    checkListReferences(values, data, file, line, pos) {
        const errors = [];
        values.forEach(v1 => {
            const valueIndex = data.values.findIndex(v2 => v2.name === v1);
            if (valueIndex === -1) {
                errors.push(this.referenceNotFoundError(file, line, pos, v1));
            }
            else if (data.values[valueIndex].type !== arcadable_shared_1.ValueType.listDeclaration && data.values[valueIndex].type !== arcadable_shared_1.ValueType.text) {
                errors.push({
                    file: file,
                    line: line,
                    pos: pos,
                    error: 'Value "' + v1 + '" not of type "List" or "String" cannot be used here.'
                });
            }
        });
        return errors;
    }
    checkInstructionSetReferences(instructionSets, await, data, file, line, pos) {
        const errors = [];
        instructionSets.forEach(i1 => {
            const instructionSetIndex = data.instructionSets.findIndex(i2 => i2.name === i1);
            if (instructionSetIndex === -1) {
                errors.push({
                    file: file,
                    line: line,
                    pos: pos,
                    error: 'Function with identifier "' + i1 + '" cannot be found.'
                });
            }
            else if (await && !data.instructionSets[instructionSetIndex].async) {
                errors.push({
                    file: file,
                    line: line,
                    pos: pos,
                    error: 'Cannot await synchronous function "' + i1 + '".'
                });
            }
        });
        return errors;
    }
    referenceNotFoundError(file, line, pos, name) {
        return {
            file: file,
            line: line,
            pos: pos,
            error: 'Reference to value with identifier "' + name + '" cannot be found.'
        };
    }
}
exports.ArcadableCompiler = ArcadableCompiler;
class ParsedProgram {
    constructor() {
        this.values = [];
        this.data = {};
        this.instructionSets = [];
        this.compressedValues = [];
        this.compressedInstructions = [];
        this.compressedInstructionSets = [];
        this.compileErrors = [];
    }
    async init(data) {
        const functionParseResultExecutables = Object.keys(data).reduce((acc, curr) => [
            ...acc,
            {
                file: data[curr].filePath,
                executables: data[curr].functionParseResults
            }
        ], []);
        const valueParseResults = Object.keys(data).reduce((acc, curr) => [
            ...acc,
            ...data[curr].valueParseResults
        ], []);
        functionParseResultExecutables.forEach(e => {
            e.executables.forEach(executable => {
                const functions = executable();
                this.instructionSets.push(...functions.map(f => ({
                    name: f.name,
                    async: f.async,
                    instructions: f.instructions.map(i => ({
                        line: i.line,
                        pos: i.pos,
                        file: e.file,
                        type: i.type,
                        params: i.params,
                        await: i.await
                    }))
                })));
                this.compileErrors.push(...functions
                    .reduce((acc, curr) => [...acc, ...curr.errors.map(err => ({
                        file: e.file,
                        line: err.line,
                        pos: err.pos,
                        error: err.error
                    }))], []));
                valueParseResults.push(...functions.reduce((acc, curr) => [...acc, ...curr.values.map(v => ({
                        parseResult: {
                            value: {
                                type: v.type,
                                value: v.value,
                                name: v.name,
                            },
                            errors: []
                        },
                        line: v.line,
                        pos: v.pos,
                        file: e.file
                    }))], []));
            });
        });
        if (valueParseResults && valueParseResults.length > 0) {
            this.values.push(...(await Promise.all(valueParseResults.filter(v => !!v.parseResult && !!v.parseResult.value).map(async (v) => {
                let value = v.parseResult.value.value;
                if (v.parseResult.value.type === arcadable_shared_1.ValueType.data) {
                    const baseName = v.file.match(/[^\/]*?\.arc/g)[0];
                    const baseDir = v.file.replace(baseName, '');
                    let dataPath = baseDir + value;
                    let backMatch = dataPath.match(/[^\/]*?\/\.\.\//g);
                    while (backMatch) {
                        dataPath = dataPath.replace(/[^\/]*?\/\.\.\//g, '');
                        backMatch = dataPath.match(/[^\/]*?\/\.\.\//g);
                    }
                    value = dataPath;
                    if (!this.data[value]) {
                        const file = vscode.Uri.file(value);
                        try {
                            this.data[value] = Array.from((await vscode.workspace.fs.readFile(file)));
                        }
                        catch (e) {
                            this.compileErrors.push({ file: v.file, line: v.line, pos: v.pos, error: `Unable to read file ${value}` });
                        }
                    }
                }
                return {
                    name: v.parseResult.value.name,
                    type: v.parseResult.value.type,
                    value,
                    line: v.line,
                    pos: v.pos,
                    file: v.file
                };
            }))));
            this.compileErrors.push(...valueParseResults
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
        }
    }
}
exports.ParsedProgram = ParsedProgram;
class CompileResult {
    constructor(config) {
        this.game = new arcadable_shared_1.Arcadable(config);
        this.compileErrors = [];
        this.parseErrors = [];
    }
    assignGameData(gameData) {
        this.parsedProgram = gameData;
        const values = this.getValuesMap(gameData);
        const unchangedValues = this.getValuesMap(gameData);
        const instructions = gameData.compressedInstructions.map((inst, i) => {
            switch (inst.type) {
                case arcadable_shared_1.InstructionType.Clear: {
                    return new arcadable_shared_1.ClearInstruction(i, '', this.game, inst.await);
                }
                case arcadable_shared_1.InstructionType.DrawCircle: {
                    return new arcadable_shared_1.DrawCircleInstruction(i, new arcadable_shared_1.NumberValueTypePointer(+inst.params[0], this.game), new arcadable_shared_1.NumberValueTypePointer(+inst.params[1], this.game), new arcadable_shared_1.NumberValueTypePointer(+inst.params[2], this.game), new arcadable_shared_1.NumberValueTypePointer(+inst.params[3], this.game), '', this.game, inst.await);
                }
                case arcadable_shared_1.InstructionType.DrawLine: {
                    return new arcadable_shared_1.DrawLineInstruction(i, new arcadable_shared_1.NumberValueTypePointer(+inst.params[0], this.game), new arcadable_shared_1.NumberValueTypePointer(+inst.params[1], this.game), new arcadable_shared_1.NumberValueTypePointer(+inst.params[2], this.game), new arcadable_shared_1.NumberValueTypePointer(+inst.params[3], this.game), new arcadable_shared_1.NumberValueTypePointer(+inst.params[4], this.game), '', this.game, inst.await);
                }
                case arcadable_shared_1.InstructionType.DrawPixel: {
                    return new arcadable_shared_1.DrawPixelInstruction(i, new arcadable_shared_1.NumberValueTypePointer(+inst.params[0], this.game), new arcadable_shared_1.NumberValueTypePointer(+inst.params[1], this.game), new arcadable_shared_1.NumberValueTypePointer(+inst.params[2], this.game), '', this.game, inst.await);
                }
                case arcadable_shared_1.InstructionType.DrawImage: {
                    return new arcadable_shared_1.DrawImageInstruction(i, new arcadable_shared_1.NumberValueTypePointer(+inst.params[0], this.game), new arcadable_shared_1.NumberValueTypePointer(+inst.params[1], this.game), new imageValueType_1.ImageValueTypePointer(+inst.params[2], this.game), '', this.game, inst.await);
                }
                case arcadable_shared_1.InstructionType.DrawRect: {
                    return new arcadable_shared_1.DrawRectInstruction(i, new arcadable_shared_1.NumberValueTypePointer(+inst.params[0], this.game), new arcadable_shared_1.NumberValueTypePointer(+inst.params[1], this.game), new arcadable_shared_1.NumberValueTypePointer(+inst.params[2], this.game), new arcadable_shared_1.NumberValueTypePointer(+inst.params[3], this.game), new arcadable_shared_1.NumberValueTypePointer(+inst.params[4], this.game), '', this.game, inst.await);
                }
                case arcadable_shared_1.InstructionType.DrawText: {
                    return new arcadable_shared_1.DrawTextInstruction(i, new arcadable_shared_1.NumberValueTypePointer(+inst.params[0], this.game), new arcadable_shared_1.NumberValueTypePointer(+inst.params[1], this.game), new valueArrayValueType_1.ValueArrayValueTypePointer(+inst.params[2], this.game), new arcadable_shared_1.NumberValueTypePointer(+inst.params[3], this.game), new arcadable_shared_1.NumberValueTypePointer(+inst.params[4], this.game), '', this.game, inst.await);
                }
                case arcadable_shared_1.InstructionType.DrawTriangle: {
                    return new arcadable_shared_1.DrawTriangleInstruction(i, new arcadable_shared_1.NumberValueTypePointer(+inst.params[0], this.game), new arcadable_shared_1.NumberValueTypePointer(+inst.params[1], this.game), new arcadable_shared_1.NumberValueTypePointer(+inst.params[2], this.game), new arcadable_shared_1.NumberValueTypePointer(+inst.params[3], this.game), new arcadable_shared_1.NumberValueTypePointer(+inst.params[4], this.game), new arcadable_shared_1.NumberValueTypePointer(+inst.params[5], this.game), new arcadable_shared_1.NumberValueTypePointer(+inst.params[6], this.game), '', this.game, inst.await);
                }
                case arcadable_shared_1.InstructionType.FillCircle: {
                    return new arcadable_shared_1.FillCircleInstruction(i, new arcadable_shared_1.NumberValueTypePointer(+inst.params[0], this.game), new arcadable_shared_1.NumberValueTypePointer(+inst.params[1], this.game), new arcadable_shared_1.NumberValueTypePointer(+inst.params[2], this.game), new arcadable_shared_1.NumberValueTypePointer(+inst.params[3], this.game), '', this.game, inst.await);
                }
                case arcadable_shared_1.InstructionType.FillRect: {
                    return new arcadable_shared_1.FillRectInstruction(i, new arcadable_shared_1.NumberValueTypePointer(+inst.params[0], this.game), new arcadable_shared_1.NumberValueTypePointer(+inst.params[1], this.game), new arcadable_shared_1.NumberValueTypePointer(+inst.params[2], this.game), new arcadable_shared_1.NumberValueTypePointer(+inst.params[3], this.game), new arcadable_shared_1.NumberValueTypePointer(+inst.params[4], this.game), '', this.game, inst.await);
                }
                case arcadable_shared_1.InstructionType.FillTriangle: {
                    return new arcadable_shared_1.FillTriangleInstruction(i, new arcadable_shared_1.NumberValueTypePointer(+inst.params[0], this.game), new arcadable_shared_1.NumberValueTypePointer(+inst.params[1], this.game), new arcadable_shared_1.NumberValueTypePointer(+inst.params[2], this.game), new arcadable_shared_1.NumberValueTypePointer(+inst.params[3], this.game), new arcadable_shared_1.NumberValueTypePointer(+inst.params[4], this.game), new arcadable_shared_1.NumberValueTypePointer(+inst.params[5], this.game), new arcadable_shared_1.NumberValueTypePointer(+inst.params[6], this.game), '', this.game, inst.await);
                }
                case arcadable_shared_1.InstructionType.MutateValue: {
                    if (values[+inst.params[0]].type === arcadable_shared_1.ValueType.text) {
                        return new arcadable_shared_1.MutateValueInstruction(i, new valueArrayValueType_1.ValueArrayValueTypePointer(+inst.params[0], this.game), new valueArrayValueType_1.ValueArrayValueTypePointer(+inst.params[1], this.game), '', this.game, inst.await);
                    }
                    else if (values[+inst.params[0]].type === arcadable_shared_1.ValueType.listDeclaration) {
                        return new arcadable_shared_1.MutateValueInstruction(i, new valueArrayValueType_1.ValueArrayValueTypePointer(+inst.params[0], this.game), new valueArrayValueType_1.ValueArrayValueTypePointer(+inst.params[1], this.game), '', this.game, inst.await);
                    }
                    else {
                        return new arcadable_shared_1.MutateValueInstruction(i, new arcadable_shared_1.NumberValueTypePointer(+inst.params[0], this.game), new arcadable_shared_1.NumberValueTypePointer(+inst.params[1], this.game), '', this.game, inst.await);
                    }
                }
                case arcadable_shared_1.InstructionType.RunCondition: {
                    return new arcadable_shared_1.RunConditionInstruction(i, new arcadable_shared_1.NumberValueTypePointer(+inst.params[0], this.game), new arcadable_shared_1.InstructionSetPointer(+inst.params[1], this.game), inst.params[2].length > 0 ? new arcadable_shared_1.InstructionSetPointer(+inst.params[2], this.game) : null, '', this.game, inst.await);
                }
                case arcadable_shared_1.InstructionType.RunSet: {
                    return new arcadable_shared_1.RunSetInstruction(i, new arcadable_shared_1.InstructionSetPointer(+inst.params[0], this.game), '', this.game, inst.await);
                }
                case arcadable_shared_1.InstructionType.SetRotation: {
                    return new arcadable_shared_1.SetRotationInstruction(i, new arcadable_shared_1.NumberValueTypePointer(+inst.params[0], this.game), '', this.game, inst.await);
                }
                case arcadable_shared_1.InstructionType.Tone: {
                    return new arcadable_shared_1.ToneInstruction(i, new arcadable_shared_1.NumberValueTypePointer(+inst.params[0], this.game), new arcadable_shared_1.NumberValueTypePointer(+inst.params[1], this.game), new arcadable_shared_1.NumberValueTypePointer(+inst.params[2], this.game), new arcadable_shared_1.NumberValueTypePointer(+inst.params[3], this.game), '', this.game, inst.await);
                }
                case arcadable_shared_1.InstructionType.DebugLog: {
                    return new arcadable_shared_1.DebugLogInstruction(i, new arcadable_shared_1.NumberValueTypePointer(+inst.params[0], this.game), '', this.game, inst.await);
                }
                case arcadable_shared_1.InstructionType.Wait: {
                    return new arcadable_shared_1.WaitInstruction(i, new arcadable_shared_1.NumberValueTypePointer(+inst.params[0], this.game), '', this.game);
                }
            }
        });
        const instructionSets = gameData.compressedInstructionSets.map((is, i) => new arcadable_shared_1.InstructionSet(i, is.instructions.length, is.instructions.map(inst => new arcadable_shared_1.InstructionPointer(inst, this.game)), is.async, '', this.game));
        const setupInstructionSet = gameData.compressedInstructionSets.findIndex(is => is.linked.findIndex(l => l.name.toLowerCase() === 'setup') !== -1);
        const mainInstructionSet = gameData.compressedInstructionSets.findIndex(is => is.linked.findIndex(l => l.name.toLowerCase() === 'main') !== -1);
        const renderInstructionSet = gameData.compressedInstructionSets.findIndex(is => is.linked.findIndex(l => l.name.toLowerCase() === 'render') !== -1);
        this.game.setGameLogic(unchangedValues, values, instructions, instructionSets, setupInstructionSet, mainInstructionSet, renderInstructionSet);
    }
    getValuesMap(gameData) {
        return gameData.compressedValues.map((v, i) => {
            switch (v.type) {
                case arcadable_shared_1.ValueType.analogInputPointer: {
                    return new arcadable_shared_1.AnalogInputValue(i, +v.value, '', this.game);
                }
                case arcadable_shared_1.ValueType.digitalInputPointer: {
                    return new arcadable_shared_1.DigitalInputValue(i, +v.value, '', this.game);
                }
                case arcadable_shared_1.ValueType.speakerOutputPointer: {
                    return new arcadable_shared_1.SpeakerOutputValue(i, +v.value, '', this.game);
                }
                case arcadable_shared_1.ValueType.evaluation: {
                    return new arcadable_shared_1.EvaluationValue(i, new arcadable_shared_1.NumberValueTypePointer(+v.value.left, this.game), new arcadable_shared_1.NumberValueTypePointer(+v.value.right, this.game), v.value.evaluation, v.value.static, '', this.game);
                }
                case arcadable_shared_1.ValueType.listValue: {
                    return new arcadable_shared_1.ListValue(i, new valueArrayValueType_1.ValueArrayValueTypePointer(+v.value.list, this.game), new arcadable_shared_1.NumberValueTypePointer(+v.value.index, this.game), '', this.game);
                }
                case arcadable_shared_1.ValueType.listDeclaration: {
                    switch (v.value.type) {
                        case arcadable_shared_1.ValueType.analogInputPointer:
                        case arcadable_shared_1.ValueType.digitalInputPointer:
                        case arcadable_shared_1.ValueType.evaluation:
                        case arcadable_shared_1.ValueType.number:
                        case arcadable_shared_1.ValueType.pixelIndex:
                        case arcadable_shared_1.ValueType.systemPointer: {
                            return new arcadable_shared_1.ListDeclaration(i, v.value.values.length, v.value.values.map(value => new arcadable_shared_1.NumberValueTypePointer(+value, this.game)), '', this.game);
                        }
                        case arcadable_shared_1.ValueType.text: {
                            return new arcadable_shared_1.ListDeclaration(i, v.value.values.length, v.value.values.map(value => new valueArrayValueType_1.ValueArrayValueTypePointer(+value, this.game)), '', this.game);
                        }
                    }
                }
                case arcadable_shared_1.ValueType.number: {
                    return new arcadable_shared_1.NumberValue(i, +v.value, 4, '', this.game);
                }
                case arcadable_shared_1.ValueType.pixelIndex: {
                    return new arcadable_shared_1.PixelValue(i, new arcadable_shared_1.NumberValueTypePointer(+v.value.x, this.game), new arcadable_shared_1.NumberValueTypePointer(+v.value.y, this.game), '', this.game);
                }
                case arcadable_shared_1.ValueType.systemPointer: {
                    return new arcadable_shared_1.SystemConfigValue(i, +v.value, '', this.game);
                }
                case arcadable_shared_1.ValueType.text: {
                    return new arcadable_shared_1.TextValue(i, v.value.values.map(value => new arcadable_shared_1.NumberValueTypePointer(+value, this.game)), v.value.values.length, '', this.game);
                }
                case arcadable_shared_1.ValueType.data: {
                    return new arcadable_shared_1.DataValue(i, gameData.data[v.value], '', this.game);
                }
                case arcadable_shared_1.ValueType.image: {
                    return new arcadable_shared_1.ImageValue(i, new arcadable_shared_1.NumberArrayValueTypePointer(+v.value.data, this.game), new arcadable_shared_1.NumberValueTypePointer(+v.value.width, this.game), new arcadable_shared_1.NumberValueTypePointer(+v.value.height, this.game), new arcadable_shared_1.NumberValueTypePointer(+v.value.keyColor, this.game), '', this.game);
                }
            }
        });
    }
}
exports.CompileResult = CompileResult;
//# sourceMappingURL=compiler.js.map