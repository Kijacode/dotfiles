"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetParseFunctionExecutable = exports.ParseValueListEval = exports.ParseValueListString = exports.ParseValueListConfig = exports.ParseValueListPixel = exports.ParseValueListDigital = exports.ParseValueListAnalog = exports.ParseValueListNumber = exports.ParseValueListValue = exports.ParseValueEval = exports.ParseValueString = exports.ParseValueConfig = exports.ParseValuePixel = exports.ParseValueSpeaker = exports.ParseValueDigital = exports.ParseValueAnalog = exports.ParseValueImage = exports.ParseValueData = exports.ParseValueNumber = exports.ParseImport = void 0;
const value_1 = require("../model/values/value");
const systemConfig_1 = require("../model/systemConfig");
const evaluationValue_1 = require("../model/values/evaluationValue");
const instruction_1 = require("../model/instructions/instruction");
function ParseImport(section) {
    const result = {
        import: '',
        errors: []
    };
    const importPathMatch = section.match(/^import( *)"([^\"]*)"/g);
    if (importPathMatch) {
        const endImportMatch = section.match(/^import( *)"([^\"]*)"END_OF_SECTION/g);
        if (endImportMatch) {
            result.import = endImportMatch[0].replace('import', '').trim().replace('"', '').replace('"END_OF_SECTION', '');
        }
        else {
            result.errors.push({ error: 'Missing ";"', pos: importPathMatch[0].length });
        }
    }
    else {
        result.errors.push({ error: 'Missing import path', pos: 0 });
    }
    return result;
}
exports.ParseImport = ParseImport;
function ParseValueNumber(section, otherMatchWithType) {
    const values = otherMatchWithType[0].replace(/\s/g, '').split(':');
    const name = values[0];
    const result = {
        value: null,
        errors: []
    };
    const numberMatch = section.match(/^([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*( *):( *)Number( *)=( *)((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+))))END_OF_SECTION$/g);
    if (numberMatch) {
        const value = numberMatch[0].replace(/\s/g, '').replace('END_OF_SECTION', '').split('=')[1];
        result.value = {
            type: value_1.ValueType.number,
            value: value,
            name
        };
    }
    else {
        result.errors.push({ error: 'Incorrect number format or missing ";"', pos: otherMatchWithType[0].length });
    }
    return result;
}
exports.ParseValueNumber = ParseValueNumber;
function ParseValueData(section, otherMatchWithType) {
    const values = otherMatchWithType[0].replace(/\s/g, '').split(':');
    const name = values[0];
    const result = {
        value: null,
        errors: []
    };
    const stringMatch = section.match(/^([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*:( *)Data( *)=( *)(("([^\"]*)")|('([^\']*)'))END_OF_SECTION$/g);
    if (stringMatch) {
        const valueRaw = stringMatch[0].replace(/\s/g, '').replace('END_OF_SECTION', '').split('=')[1];
        const value = valueRaw.charAt(0) === '"' ? valueRaw.replace(/"/g, '') : valueRaw.replace(/'/g, '');
        result.value = {
            type: value_1.ValueType.data,
            value: value,
            name
        };
    }
    else {
        result.errors.push({ error: 'Incorrect data path format or missing ";"', pos: otherMatchWithType[0].length });
    }
    return result;
}
exports.ParseValueData = ParseValueData;
function ParseValueImage(section, otherMatchWithType) {
    const values = otherMatchWithType[0].replace(/\s/g, '').split(':');
    const name = values[0];
    const result = [];
    const main = {
        value: null,
        errors: []
    };
    const imageMatch = section.match(/^([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*:( *)Image( *)=( *)\[( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|(("([^\"]*)")|('([^\']*)')))( *)(( *),( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))){3}( *)\]END_OF_SECTION$/g);
    if (imageMatch) {
        const value = imageMatch[0].replace(/\s/g, '').replace('END_OF_SECTION', '').split('=')[1];
        const values = value.replace('[', '').replace(']', '').replace(/\s/g, '').split(',');
        let data = values[0];
        let width = values[1];
        let height = values[2];
        let keyColor = values[3];
        const originalPathLength = data.length;
        data = data.charAt(0) === '"' ? data.replace(/"/g, '') : data.replace(/'/g, '');
        if (data.length !== originalPathLength) {
            const subDataName = name + '-data';
            const subDataValue = {
                value: {
                    type: value_1.ValueType.data,
                    value: data,
                    name: subDataName
                },
                errors: []
            };
            data = subDataName;
            result.push(subDataValue);
        }
        const parsedWidth = Number.parseInt(width);
        if (!Number.isNaN(parsedWidth)) {
            const subWidthName = name + '-width';
            const subWidthValue = {
                value: {
                    type: value_1.ValueType.number,
                    value: parsedWidth,
                    name: subWidthName
                },
                errors: []
            };
            width = subWidthName;
            result.push(subWidthValue);
        }
        const parsedHeight = Number.parseInt(height);
        if (!Number.isNaN(parsedHeight)) {
            const subHeightName = name + '-height';
            const subHeightValue = {
                value: {
                    type: value_1.ValueType.number,
                    value: parsedHeight,
                    name: subHeightName
                },
                errors: []
            };
            height = subHeightName;
            result.push(subHeightValue);
        }
        const parsedKeyColor = Number.parseInt(keyColor);
        if (!Number.isNaN(parsedKeyColor)) {
            const subKeyColorName = name + '-keyColor';
            const subKeyColorValue = {
                value: {
                    type: value_1.ValueType.number,
                    value: parsedKeyColor,
                    name: subKeyColorName
                },
                errors: []
            };
            keyColor = subKeyColorName;
            result.push(subKeyColorValue);
        }
        main.value = {
            type: value_1.ValueType.image,
            value: {
                data,
                width,
                height,
                keyColor
            },
            name
        };
    }
    else {
        main.errors.push({ error: 'Incorrect image declaration format (=[path, width, height, keyColor]) or missing ";"', pos: otherMatchWithType[0].length });
    }
    result.push(main);
    return result;
}
exports.ParseValueImage = ParseValueImage;
function ParseValueAnalog(section, otherMatchWithType) {
    const values = otherMatchWithType[0].replace(/\s/g, '').split(':');
    const name = values[0];
    const result = {
        value: null,
        errors: []
    };
    const analogMatch = section.match(/^([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*( *):( *)Analog( *)=( *)(([0-9]+))END_OF_SECTION$/g);
    if (analogMatch) {
        const value = analogMatch[0].replace(/\s/g, '').replace('END_OF_SECTION', '').split('=')[1];
        result.value = {
            type: value_1.ValueType.analogInputPointer,
            value,
            name
        };
    }
    else {
        result.errors.push({ error: 'Incorrect analog index format or missing ";"', pos: otherMatchWithType[0].length });
    }
    return result;
}
exports.ParseValueAnalog = ParseValueAnalog;
function ParseValueDigital(section, otherMatchWithType) {
    const values = otherMatchWithType[0].replace(/\s/g, '').split(':');
    const name = values[0];
    const result = {
        value: null,
        errors: [],
    };
    const digitalMatch = section.match(/^([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*( *):( *)Digital( *)=( *)(([0-9]+))END_OF_SECTION$/g);
    if (digitalMatch) {
        const value = digitalMatch[0].replace(/\s/g, '').replace('END_OF_SECTION', '').split('=')[1];
        result.value = {
            type: value_1.ValueType.digitalInputPointer,
            value,
            name
        };
    }
    else {
        result.errors.push({ error: 'Incorrect digital index format or missing ";"', pos: otherMatchWithType[0].length });
    }
    return result;
}
exports.ParseValueDigital = ParseValueDigital;
function ParseValueSpeaker(section, otherMatchWithType) {
    const values = otherMatchWithType[0].replace(/\s/g, '').split(':');
    const name = values[0];
    const result = {
        value: null,
        errors: []
    };
    const speakerMatch = section.match(/^([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*( *):( *)Speaker( *)=( *)(([0-9]+))END_OF_SECTION$/g);
    if (speakerMatch) {
        const value = speakerMatch[0].replace(/\s/g, '').replace('END_OF_SECTION', '').split('=')[1];
        result.value = {
            type: value_1.ValueType.speakerOutputPointer,
            value,
            name
        };
    }
    else {
        result.errors.push({ error: 'Incorrect speaker index format or missing ";"', pos: otherMatchWithType[0].length });
    }
    return result;
}
exports.ParseValueSpeaker = ParseValueSpeaker;
function ParseValuePixel(section, otherMatchWithType) {
    const values = otherMatchWithType[0].replace(/\s/g, '').split(':');
    const name = values[0];
    const result = [];
    const main = {
        value: null,
        errors: []
    };
    const pixelMatch = section.match(/^([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*:( *)Pixel( *)=( *)(\[( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|([0-9]+))( *),( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|([0-9]+))( *)\])END_OF_SECTION$/g);
    if (pixelMatch) {
        const value = pixelMatch[0].replace(/\s/g, '').replace('END_OF_SECTION', '').split('=')[1];
        const values = value.replace('[', '').replace(']', '').replace(/\s/g, '').split(',');
        let x = values[0];
        let y = values[1];
        const parsedX = Number.parseInt(x);
        if (!Number.isNaN(parsedX)) {
            const subXName = name + '-x';
            const subXValue = {
                value: {
                    type: value_1.ValueType.number,
                    value: parsedX,
                    name: subXName
                },
                errors: []
            };
            x = subXName;
            result.push(subXValue);
        }
        const parsedY = Number.parseInt(y);
        if (!Number.isNaN(parsedY)) {
            const subYName = name + '-y';
            const subYValue = {
                value: {
                    type: value_1.ValueType.number,
                    value: parsedY,
                    name: subYName
                },
                errors: []
            };
            y = subYName;
            result.push(subYValue);
        }
        main.value = {
            type: value_1.ValueType.pixelIndex,
            value: {
                x,
                y
            },
            name
        };
    }
    else {
        main.errors.push({ error: 'Incorrect pixel position format (=[x, y]) or missing ";"', pos: otherMatchWithType[0].length });
    }
    result.push(main);
    return result;
}
exports.ParseValuePixel = ParseValuePixel;
function ParseValueConfig(section, otherMatchWithType) {
    const values = otherMatchWithType[0].replace(/\s/g, '').split(':');
    const name = values[0];
    const result = {
        value: null,
        errors: []
    };
    const configMatch = section.match(/^([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*:( *)Config( *)=( *)(ScreenHeight|ScreenWidth|CurrentMillis|IsZigZag)END_OF_SECTION$/g);
    if (configMatch) {
        const value = configMatch[0].replace(/\s/g, '').replace('END_OF_SECTION', '').split('=')[1];
        let configType = getSystemConfigType(value);
        result.value = {
            type: value_1.ValueType.systemPointer,
            value: configType,
            name
        };
    }
    else {
        result.errors.push({ error: 'Unknown system config identifier (known identifiers: ScreenHeight, ScreenWidth, CurrentMillis, IsZigZag) or missing ";"', pos: otherMatchWithType[0].length });
    }
    return result;
}
exports.ParseValueConfig = ParseValueConfig;
function ParseValueString(section, otherMatchWithType) {
    const values = otherMatchWithType[0].replace(/\s/g, '').split(':');
    const name = values[0];
    const result = [];
    const main = {
        value: null,
        errors: []
    };
    const stringMatch = section.match(/^([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*:( *)String( *)=( *)(("([^\"]*)")|('([^\']*)'))END_OF_SECTION$/g);
    if (stringMatch) {
        const valueRaw = stringMatch[0].replace(/\s/g, '').replace('END_OF_SECTION', '').split('=')[1];
        const value = valueRaw.charAt(0) === '"' ? valueRaw.replace(/"/g, '') : valueRaw.replace(/'/g, '');
        const actualValues = [];
        [...value].forEach((char, i) => {
            const parsed = char.charCodeAt(0);
            const subName = name + '-sub' + i;
            const subValue = {
                value: {
                    type: value_1.ValueType.number,
                    value: parsed,
                    name: subName
                },
                errors: []
            };
            actualValues.push(subName);
            result.push(subValue);
        });
        main.value = {
            type: value_1.ValueType.text,
            value: {
                values: actualValues,
                type: value_1.ValueType.number
            },
            name
        };
    }
    else {
        main.errors.push({ error: 'Incorrect string format or missing ";"', pos: otherMatchWithType[0].length });
    }
    result.push(main);
    return result;
}
exports.ParseValueString = ParseValueString;
function ParseValueEval(section, otherMatchWithType) {
    const values = otherMatchWithType[0].replace(/\s/g, '').split(':');
    const name = values[0];
    const result = [];
    const main = {
        value: null,
        errors: []
    };
    const evalMatch = section.match(/^([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*:( *)Eval( *)=( *)(static)?( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *)(\+|-|\*|\/|%|&|\||\^|<<|>>|pow|==|!=|>|<|>=|<=)( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))END_OF_SECTION$/g);
    if (evalMatch) {
        let value = evalMatch[0].replace(/\s/g, '').replace('END_OF_SECTION', '').split(/=(.+)/g)[1];
        const stat = value.startsWith('static');
        if (stat) {
            value = value.replace('static', '');
        }
        const evaluation = value.match(/(\+|-|\*|\/|%|&|\||\^|<<|>>|pow|==|!=|>|<|>=|<=)/g)[0];
        const values = value.split(evaluation);
        let evaluationType = getEvaluationOperator(evaluation);
        let left = values[0];
        let right = values[1];
        const parsedLeft = Number.parseFloat(left);
        if (!Number.isNaN(parsedLeft)) {
            const subLeftName = name + '-left';
            const subLeftValue = {
                value: {
                    type: value_1.ValueType.number,
                    value: parsedLeft,
                    name: subLeftName
                },
                errors: []
            };
            left = subLeftName;
            result.push(subLeftValue);
        }
        const parsedRight = Number.parseFloat(right);
        if (!Number.isNaN(parsedRight)) {
            const subRightName = name + '-right';
            const subRightValue = {
                value: {
                    type: value_1.ValueType.number,
                    value: parsedRight,
                    name: subRightName
                },
                errors: []
            };
            right = subRightName;
            result.push(subRightValue);
        }
        main.value = {
            type: value_1.ValueType.evaluation,
            value: {
                evaluation: evaluationType,
                left,
                right,
                static: stat
            },
            name
        };
    }
    else {
        main.errors.push({ error: 'Incorrect evaluation format or missing ";"', pos: otherMatchWithType[0].length });
    }
    result.push(main);
    return result;
}
exports.ParseValueEval = ParseValueEval;
function ParseValueListValue(section, otherMatchWithType) {
    const values = otherMatchWithType[0].replace(/\s/g, '').split(':');
    const name = values[0];
    const result = [];
    const main = {
        value: null,
        errors: []
    };
    const listValueMatch = section.match(/^([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*:( *)ListValue( *)=( *)([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*\[((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|(([0-9]+)))\]END_OF_SECTION$/g);
    if (listValueMatch) {
        const valueRaw = listValueMatch[0].replace(/\s/g, '').replace('END_OF_SECTION', '').split('=')[1];
        const list = valueRaw.split(/\[/g)[0];
        let index = valueRaw.split(/\[/g)[1].replace(/\]/g, '');
        const parsedIndex = Number.parseInt(index);
        if (!Number.isNaN(parsedIndex)) {
            const subIndexName = name + '-y';
            const subIndexValue = {
                value: {
                    type: value_1.ValueType.number,
                    value: parsedIndex,
                    name: subIndexName
                },
                errors: []
            };
            index = subIndexName;
            result.push(subIndexValue);
        }
        main.value = {
            type: value_1.ValueType.listValue,
            value: {
                list,
                index,
            },
            name
        };
    }
    else {
        main.errors.push({ error: 'Incorrect string format or missing ";"', pos: otherMatchWithType[0].length });
    }
    result.push(main);
    return result;
}
exports.ParseValueListValue = ParseValueListValue;
function ParseValueListNumber(section, otherMatchWithType) {
    const values = otherMatchWithType[0].replace(/\s/g, '').split(':');
    const name = values[0];
    const result = [];
    const main = {
        value: null,
        errors: []
    };
    const listMatch = section.match(/^([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*:( *)List<( *)Number( *)>( *)=( *)(\[( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *))+(,( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+))))))*( *)\]END_OF_SECTION$/g);
    if (listMatch) {
        const value = listMatch[0].replace(/\s/g, '').replace('END_OF_SECTION', '').split('=')[1];
        const values = value.replace('[', '').replace(']', '').replace(/\s/g, '').split(',');
        const actualValues = [];
        values.forEach((v, i) => {
            const parsed = Number.parseFloat(v);
            if (!Number.isNaN(parsed)) {
                const subName = name + '-sub' + i;
                const subValue = {
                    value: {
                        type: value_1.ValueType.number,
                        value: parsed,
                        name: subName
                    },
                    errors: []
                };
                actualValues.push(subName);
                result.push(subValue);
            }
            else {
                actualValues.push(v);
            }
        });
        main.value = {
            type: value_1.ValueType.listDeclaration,
            value: {
                values: actualValues,
                type: value_1.ValueType.number
            },
            name
        };
    }
    else {
        main.errors.push({ error: 'Incorrect number list format (List<Number> = [myNumber, anotherNumber]) or incorrect number format or missing ";"', pos: otherMatchWithType[0].length });
    }
    result.push(main);
    return result;
}
exports.ParseValueListNumber = ParseValueListNumber;
//ParseValueListImage todo
//ParseValueListData todo
function ParseValueListAnalog(section, otherMatchWithType) {
    const values = otherMatchWithType[0].replace(/\s/g, '').split(':');
    const name = values[0];
    const result = [];
    const main = {
        value: null,
        errors: []
    };
    const listMatch = section.match(/^([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*:( *)List<( *)Analog( *)>( *)=( *)(\[( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|(([0-9]+)))( *))+(,( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|(([0-9]+))))*( *)\]END_OF_SECTION$/g);
    if (listMatch) {
        const value = listMatch[0].replace(/\s/g, '').replace('END_OF_SECTION', '').split('=')[1];
        const values = value.replace('[', '').replace(']', '').replace(/\s/g, '').split(',');
        const actualValues = [];
        values.forEach((v, i) => {
            const parsed = Number.parseInt(v);
            if (!Number.isNaN(parsed)) {
                const subName = name + '-sub' + i;
                const subValue = {
                    value: {
                        type: value_1.ValueType.analogInputPointer,
                        value: parsed,
                        name: subName
                    },
                    errors: []
                };
                actualValues.push(subName);
                result.push(subValue);
            }
            else {
                actualValues.push(v);
            }
        });
        main.value = {
            type: value_1.ValueType.listDeclaration,
            value: {
                values: actualValues,
                type: value_1.ValueType.analogInputPointer,
            },
            name
        };
    }
    else {
        main.errors.push({ error: 'Incorrect analog list format (List<Analog> = [myAnalog, 1]) or missing ";"', pos: otherMatchWithType[0].length });
    }
    result.push(main);
    return result;
}
exports.ParseValueListAnalog = ParseValueListAnalog;
function ParseValueListDigital(section, otherMatchWithType) {
    const values = otherMatchWithType[0].replace(/\s/g, '').split(':');
    const name = values[0];
    const result = [];
    const main = {
        value: null,
        errors: []
    };
    const listMatch = section.match(/^([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*:( *)List<( *)Digital( *)>( *)=( *)(\[( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|(([0-9]+)))( *))+(,( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|(([0-9]+))))*( *)\]END_OF_SECTION$/g);
    if (listMatch) {
        const value = listMatch[0].replace(/\s/g, '').replace('END_OF_SECTION', '').split('=')[1];
        const values = value.replace('[', '').replace(']', '').replace(/\s/g, '').split(',');
        const actualValues = [];
        values.forEach((v, i) => {
            const parsed = Number.parseInt(v);
            if (!Number.isNaN(parsed)) {
                const subName = name + '-sub' + i;
                const subValue = {
                    value: {
                        type: value_1.ValueType.digitalInputPointer,
                        value: parsed,
                        name: subName
                    },
                    errors: []
                };
                actualValues.push(subName);
                result.push(subValue);
            }
            else {
                actualValues.push(v);
            }
        });
        main.value = {
            type: value_1.ValueType.listDeclaration,
            value: {
                values: actualValues,
                type: value_1.ValueType.digitalInputPointer
            },
            name
        };
    }
    else {
        main.errors.push({ error: 'Incorrect digital list format (List<Digital> = [myDigital, 1]) or missing ";"', pos: otherMatchWithType[0].length });
    }
    result.push(main);
    return result;
}
exports.ParseValueListDigital = ParseValueListDigital;
function ParseValueListPixel(section, otherMatchWithType) {
    const values = otherMatchWithType[0].replace(/\s/g, '').split(':');
    const name = values[0];
    const result = [];
    const main = {
        value: null,
        errors: []
    };
    const listMatch = section.match(/^([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*:( *)List<( *)Pixel( *)>( *)=( *)(\[( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|(\[( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|([0-9]+))( *),( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|([0-9]+))( *)\]))( *))+(,( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|(\[( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|([0-9]+))( *),( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|([0-9]+))( *)\])))*( *)\]END_OF_SECTION$/g);
    if (listMatch) {
        const value = listMatch[0].replace(/\s/g, '').replace('END_OF_SECTION', '').split('=')[1];
        const values = value.substr(1).replace(/\]/g, '').replace(/\s/g, '').split('[').map(s => s.split(',').filter(p => p.length > 0));
        const actualValues = [];
        values.forEach((v, i) => {
            if (v.length > 1) {
                const subName = name + '-sub' + i;
                let x = v[0];
                let y = v[1];
                const parsedX = Number.parseInt(x);
                if (!Number.isNaN(parsedX)) {
                    const subXName = subName + '-x';
                    const subXValue = {
                        value: {
                            type: value_1.ValueType.number,
                            value: parsedX,
                            name: subXName
                        },
                        errors: []
                    };
                    x = subXName;
                    result.push(subXValue);
                }
                const parsedY = Number.parseInt(y);
                if (!Number.isNaN(parsedY)) {
                    const subYName = subName + '-y';
                    const subYValue = {
                        value: {
                            type: value_1.ValueType.number,
                            value: parsedY,
                            name: subYName
                        },
                        errors: []
                    };
                    y = subYName;
                    result.push(subYValue);
                }
                const subValue = {
                    value: {
                        type: value_1.ValueType.pixelIndex,
                        value: {
                            x,
                            y
                        },
                        name: subName
                    },
                    errors: []
                };
                result.push(subValue);
                actualValues.push(subName);
            }
            else if (v[0] && v[0].length > 0) {
                actualValues.push(v[0]);
            }
        });
        main.value = {
            type: value_1.ValueType.listDeclaration,
            value: {
                values: actualValues,
                type: value_1.ValueType.pixelIndex
            },
            name
        };
    }
    else {
        main.errors.push({ error: 'Incorrect pixel list format (List<Pixel> = [myPixel, [myNumber, 1]]) or missing ";"', pos: otherMatchWithType[0].length });
    }
    result.push(main);
    return result;
}
exports.ParseValueListPixel = ParseValueListPixel;
function ParseValueListConfig(section, otherMatchWithType) {
    const values = otherMatchWithType[0].replace(/\s/g, '').split(':');
    const name = values[0];
    const result = [];
    const main = {
        value: null,
        errors: []
    };
    const listMatch = section.match(/^([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*:( *)List<( *)Config( *)>( *)=( *)(\[( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*))( *))+(,( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)))*( *)\]END_OF_SECTION$/g);
    if (listMatch) {
        const value = listMatch[0].replace(/\s/g, '').replace('END_OF_SECTION', '').split('=')[1];
        const values = value.replace('[', '').replace(']', '').replace(/\s/g, '').split(',');
        const actualValues = [];
        values.forEach((v, i) => {
            const configMatch = v.match(/ScreenHeight|ScreenWidth|CurrentMillis|IsZigZag/g);
            if (configMatch) {
                const subName = name + '-sub' + i;
                let configType = getSystemConfigType(v);
                const subValue = {
                    value: {
                        type: value_1.ValueType.systemPointer,
                        value: configType,
                        name: subName
                    },
                    errors: []
                };
                actualValues.push(subName);
                result.push(subValue);
            }
            else {
                actualValues.push(v);
            }
        });
        main.value = {
            type: value_1.ValueType.listDeclaration,
            value: {
                values: actualValues,
                type: value_1.ValueType.systemPointer
            },
            name
        };
    }
    else {
        main.errors.push({ error: 'Incorrect number list format (List<Number> = [myNumber, anotherNumber]) or incorrect number format or missing ";"', pos: otherMatchWithType[0].length });
    }
    result.push(main);
    return result;
}
exports.ParseValueListConfig = ParseValueListConfig;
function ParseValueListString(section, otherMatchWithType) {
    const values = otherMatchWithType[0].replace(/\s/g, '').split(':');
    const name = values[0];
    const result = [];
    const main = {
        value: null,
        errors: []
    };
    const listMatch = section.match(/^([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*:( *)List<( *)String( *)>( *)=( *)(\[( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|(("([^\"]*)")|('([^\']*)')))( *))+(,( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|(("([^\"]*)")|('([^\']*)'))))*( *)\]END_OF_SECTION$/g);
    if (listMatch) {
        const value = listMatch[0].replace(/\s/g, '').replace('END_OF_SECTION', '').split('=')[1];
        const values = value.replace('[', '').replace(']', '').replace(/\s/g, '').split(',');
        const actualValues = [];
        values.forEach((v, i) => {
            const first = v.charAt(0);
            const last = v.charAt(v.length - 1);
            if ((first === '"' && last === '"') || (first === '\'' && last === '\'')) {
                const subName = name + '-sub' + i;
                const value = first === '"' ? v.replace(/"/g, '') : v.replace(/'/g, '');
                const actualStringValues = [];
                [...value].forEach((char, i) => {
                    const parsed = char.charCodeAt(0);
                    const subStringName = name + '-sub' + i;
                    const subStringValue = {
                        value: {
                            type: value_1.ValueType.number,
                            value: parsed,
                            name: subStringName
                        },
                        errors: []
                    };
                    actualStringValues.push(subStringName);
                    result.push(subStringValue);
                });
                const subValue = {
                    value: {
                        type: value_1.ValueType.text,
                        value: {
                            values: actualStringValues,
                            type: value_1.ValueType.number
                        },
                        name: subName
                    },
                    errors: []
                };
                actualValues.push(subName);
                result.push(subValue);
            }
            else {
                actualValues.push(v);
            }
        });
        main.value = {
            type: value_1.ValueType.listDeclaration,
            value: {
                values: actualValues,
                type: value_1.ValueType.text
            },
            name
        };
    }
    else {
        main.errors.push({ error: 'Incorrect number list format (List<Number> = [myNumber, anotherNumber]) or incorrect number format or missing ";"', pos: otherMatchWithType[0].length });
    }
    result.push(main);
    return result;
}
exports.ParseValueListString = ParseValueListString;
function ParseValueListEval(section, otherMatchWithType) {
    const values = otherMatchWithType[0].replace(/\s/g, '').split(':');
    const name = values[0];
    const result = [];
    const main = {
        value: null,
        errors: []
    };
    const listMatch = section.match(/^([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*:( *)List<( *)Eval( *)>( *)=( *)(\[( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((static)?( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *)(\+|-|\*|\/|%|&|\||\^|<<|>>|pow|==|!=|>|<|>=|<=)( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))))( *))+(,( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((static)?( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *)(\+|-|\*|\/|%|&|\||\^|<<|>>|pow|==|!=|>|<|>=|<=)( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+))))))))*( *)\]END_OF_SECTION$/g);
    if (listMatch) {
        const value = listMatch[0].replace(/\s/g, '').replace('END_OF_SECTION', '').split('=')[1];
        const values = value.replace('[', '').replace(']', '').replace(/\s/g, '').split(',');
        const actualValues = [];
        values.forEach((v, i) => {
            const evaluation = v.match(/(\+|-|\*|\/|%|&|\||\^|<<|>>|pow|==|!=|>|<|>=|<=)/g);
            if (evaluation) {
                const stat = v.startsWith('static');
                if (stat) {
                    v = v.replace('static', '');
                }
                const values = v.split(evaluation[0]);
                let evaluationType = getEvaluationOperator(evaluation[0]);
                const subName = name + '-sub' + i;
                let left = values[0];
                let right = values[1];
                const parsedLeft = Number.parseFloat(left);
                if (!Number.isNaN(parsedLeft)) {
                    const subLeftName = subName + '-left';
                    const subLeftValue = {
                        value: {
                            type: value_1.ValueType.number,
                            value: parsedLeft,
                            name: subLeftName
                        },
                        errors: []
                    };
                    left = subLeftName;
                    result.push(subLeftValue);
                }
                const parsedRight = Number.parseFloat(right);
                if (!Number.isNaN(parsedRight)) {
                    const subRightName = subName + '-right';
                    const subRightValue = {
                        value: {
                            type: value_1.ValueType.number,
                            value: parsedRight,
                            name: subRightName
                        },
                        errors: []
                    };
                    right = subRightName;
                    result.push(subRightValue);
                }
                const subValue = {
                    value: {
                        type: value_1.ValueType.evaluation,
                        value: {
                            evaluation: evaluationType,
                            left,
                            right,
                            static: stat
                        },
                        name: subName
                    },
                    errors: []
                };
                actualValues.push(subName);
                result.push(subValue);
            }
            else {
                actualValues.push(v);
            }
        });
        main.value = {
            type: value_1.ValueType.listDeclaration,
            value: {
                values: actualValues,
                type: value_1.ValueType.evaluation
            },
            name
        };
    }
    else {
        main.errors.push({ error: 'Incorrect number list format (List<Number> = [myNumber, anotherNumber]) or incorrect number format or missing ";"', pos: otherMatchWithType[0].length });
    }
    result.push(main);
    return result;
}
exports.ParseValueListEval = ParseValueListEval;
function GetParseFunctionExecutable(section, otherMatchWithType, lineNumber, lines, async) {
    const values = otherMatchWithType[0].replace(/\s/g, '').split(':');
    const name = values[0];
    const line = lines[lineNumber];
    const codeLine = line.split(/\/\//g)[0];
    const result = {
        functionParseExecutable: () => [],
        errors: [],
        parsedCount: 0
    };
    const functionStartMatch = section.match(/^([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*:( *)(AsyncFunction|Function)( *){( *)END_OF_SECTION$/g);
    if (functionStartMatch) {
        let functionLines = [];
        let functionLineNumber = lineNumber;
        let functionCodeLine = codeLine.trim();
        let level = 1;
        let continueSearch = true;
        let parsedLinesCount = 1;
        while (continueSearch) {
            if (functionLineNumber + 1 < lines.length) {
                functionLineNumber++;
                const functionLine = lines[functionLineNumber];
                functionCodeLine = functionLine.split(/\/\//g)[0];
                if (functionCodeLine.includes('{')) {
                    level++;
                }
                if (functionCodeLine.includes('}')) {
                    level--;
                }
                if (level > 0) {
                    functionLines[parsedLinesCount - 1] = functionCodeLine;
                }
                else {
                    continueSearch = false;
                }
                parsedLinesCount++;
            }
            else {
                continueSearch = false;
                result.errors.push({ error: 'Closing bracket not found', pos: 0, line: lineNumber + 1 });
            }
        }
        result.functionParseExecutable = () => parseInstructionSet(lineNumber, functionLines, name, !!async);
        result.parsedCount += parsedLinesCount;
    }
    else {
        result.parsedCount = 1;
        result.errors.push({ error: 'Incorrect function format', pos: otherMatchWithType[0].length, line: lineNumber + 1 });
    }
    return result;
}
exports.GetParseFunctionExecutable = GetParseFunctionExecutable;
function parseInstructionSet(instructionSetStartLine, lines, name, async) {
    const resultList = [];
    const result = {
        name,
        instructions: [],
        values: [],
        errors: [],
        async
    };
    for (let lineNumber = 0; lineNumber < lines.length;) {
        const line = lines[lineNumber];
        const sections = line.split(/;/g);
        let totalPosition = 0;
        let parsedLinesCount = 1;
        sections.forEach(section => {
            section = section.trimEnd() + 'END_OF_SECTION';
            let position = 0;
            let char = section.charAt(position);
            while (char.match(/\s/g)) {
                position++;
                char = section.charAt(position);
            }
            const drawMatch = section.substr(position).match(/^draw\./g);
            const executeMatch = section.substr(position).match(/^(await( +?))?execute/g);
            const mutateMatch = section.substr(position).match(/^(([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)( *)=/g);
            const conditionMatch = section.substr(position).match(/^if/g);
            const debugMatch = section.substr(position).match(/^log/g);
            const waitMatch = section.substr(position).match(/^wait/g);
            const toneMatch = section.substr(position).match(/^(await( +?))?tone/g);
            if (drawMatch) {
                const drawMatchType = section.substr(position).match(/^draw\.(clear|(drawPixel|drawText|drawCircle|drawImage|fillCircle|drawRect|fillRect|drawTriangle|fillTriangle|drawLine|setRotation))/g);
                if (drawMatchType) {
                    let drawInstruction = {
                        type: -1,
                        params: [],
                        line: instructionSetStartLine + lineNumber + 2,
                        pos: position + totalPosition,
                        await: false
                    };
                    switch (drawMatchType[0]) {
                        case 'draw.clear': {
                            const drawClearMatch = section.substr(position).match(/^draw\.clearEND_OF_SECTION$/g);
                            if (drawClearMatch) {
                                drawInstruction.type = instruction_1.InstructionType.Clear;
                            }
                            else {
                                result.errors.push({ error: 'Unexpected draw.clear format, or missing ";"', pos: position + totalPosition + drawMatch[0].length, line: instructionSetStartLine + lineNumber + 2 });
                            }
                            break;
                        }
                        case 'draw.drawPixel': {
                            const drawPixelMatch = section.substr(position).match(/^draw\.drawPixel\(( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *),( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *),( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *)( *)\)END_OF_SECTION$/g);
                            if (drawPixelMatch) {
                                const params = drawPixelMatch[0].replace(/\s/g, '').replace('draw.drawPixel(', '').replace(')END_OF_SECTION', '').split(',');
                                drawInstruction.type = instruction_1.InstructionType.DrawPixel;
                                drawInstruction.params = params;
                            }
                            else {
                                result.errors.push({ error: 'Unexpected draw.drawPixel format ("draw.drawPixel(color, x, y)"), or missing ";"', pos: position + totalPosition + drawMatch[0].length, line: instructionSetStartLine + lineNumber + 2 });
                            }
                            break;
                        }
                        case 'draw.drawText': {
                            const drawTextMatch = section.substr(position).match(/^draw\.drawText\(( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *),( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *),( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *),( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *),( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *)\)END_OF_SECTION$/g);
                            if (drawTextMatch) {
                                const params = drawTextMatch[0].replace(/\s/g, '').replace('draw.drawText(', '').replace(')END_OF_SECTION', '').split(',');
                                drawInstruction.type = instruction_1.InstructionType.DrawText;
                                drawInstruction.params = params;
                            }
                            else {
                                result.errors.push({ error: 'Unexpected draw.drawText format ("draw.drawText(color, scale, text, x, y)"), or missing ";"', pos: position + totalPosition + drawMatch[0].length, line: instructionSetStartLine + lineNumber + 2 });
                            }
                            break;
                        }
                        case 'draw.drawImage': {
                            const drawImageMatch = section.substr(position).match(/^draw\.drawImage\(( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *),( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *),( *)(([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)( *)\)END_OF_SECTION$/g);
                            if (drawImageMatch) {
                                const params = drawImageMatch[0].replace(/\s/g, '').replace('draw.drawImage(', '').replace(')END_OF_SECTION', '').split(',');
                                drawInstruction.type = instruction_1.InstructionType.DrawImage;
                                drawInstruction.params = params;
                            }
                            else {
                                result.errors.push({ error: 'Unexpected draw.drawImage format ("draw.drawImage(x, y, imageData)"), or missing ";"', pos: position + totalPosition + drawMatch[0].length, line: instructionSetStartLine + lineNumber + 2 });
                            }
                            break;
                        }
                        case 'draw.drawCircle': {
                            const drawCircleMatch = section.substr(position).match(/^draw\.drawCircle\(( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *),( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *),( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *),( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *)\)END_OF_SECTION$/g);
                            if (drawCircleMatch) {
                                const params = drawCircleMatch[0].replace(/\s/g, '').replace('draw.drawCircle(', '').replace(')END_OF_SECTION', '').split(',');
                                drawInstruction.type = instruction_1.InstructionType.DrawCircle;
                                drawInstruction.params = params;
                            }
                            else {
                                result.errors.push({ error: 'Unexpected draw.drawCircle format ("draw.drawCircle(color, radius, x, y)"), or missing ";"', pos: position + totalPosition + drawMatch[0].length, line: instructionSetStartLine + lineNumber + 2 });
                            }
                            break;
                        }
                        case 'draw.fillCircle': {
                            const fillCircleMatch = section.substr(position).match(/^draw\.fillCircle\(( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *),( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *),( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *),( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *)\)END_OF_SECTION$/g);
                            if (fillCircleMatch) {
                                const params = fillCircleMatch[0].replace(/\s/g, '').replace('draw.fillCircle(', '').replace(')END_OF_SECTION', '').split(',');
                                drawInstruction.type = instruction_1.InstructionType.FillCircle;
                                drawInstruction.params = params;
                            }
                            else {
                                result.errors.push({ error: 'Unexpected draw.fillCircle format ("draw.fillCircle(color, radius, x, y)"), or missing ";"', pos: position + totalPosition + drawMatch[0].length, line: instructionSetStartLine + lineNumber + 2 });
                            }
                            break;
                        }
                        case 'draw.drawRect': {
                            const drawRectMatch = section.substr(position).match(/^draw\.drawRect\(( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *),( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *),( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *),( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *),( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *)\)END_OF_SECTION$/g);
                            if (drawRectMatch) {
                                const params = drawRectMatch[0].replace(/\s/g, '').replace('draw.drawRect(', '').replace(')END_OF_SECTION', '').split(',');
                                drawInstruction.type = instruction_1.InstructionType.DrawRect;
                                drawInstruction.params = params;
                            }
                            else {
                                result.errors.push({ error: 'Unexpected draw.drawRect format ("draw.drawRect(color, tlX, tlY, brX, brY)"), or missing ";"', pos: position + totalPosition + drawMatch[0].length, line: instructionSetStartLine + lineNumber + 2 });
                            }
                            break;
                        }
                        case 'draw.fillRect': {
                            const fillRectMatch = section.substr(position).match(/^draw\.fillRect\(( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *),( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *),( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *),( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *),( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *)\)END_OF_SECTION$/g);
                            if (fillRectMatch) {
                                const params = fillRectMatch[0].replace(/\s/g, '').replace('draw.fillRect(', '').replace(')END_OF_SECTION', '').split(',');
                                drawInstruction.type = instruction_1.InstructionType.FillRect;
                                drawInstruction.params = params;
                            }
                            else {
                                result.errors.push({ error: 'Unexpected draw.fillRect format ("draw.fillRect(color, tlX, tlY, brX, brY)"), or missing ";"', pos: position + totalPosition + drawMatch[0].length, line: instructionSetStartLine + lineNumber + 2 });
                            }
                            break;
                        }
                        case 'draw.drawTriangle': {
                            const drawTriangleMatch = section.substr(position).match(/^draw\.drawTriangle\(( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *),( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *),( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *),( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *),( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *),( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *),( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *)\)END_OF_SECTION$/g);
                            if (drawTriangleMatch) {
                                const params = drawTriangleMatch[0].replace(/\s/g, '').replace('draw.drawTriangle(', '').replace(')END_OF_SECTION', '').split(',');
                                drawInstruction.type = instruction_1.InstructionType.DrawTriangle;
                                drawInstruction.params = params;
                            }
                            else {
                                result.errors.push({ error: 'Unexpected draw.drawTriangle format ("draw.drawTriangle(color, x1, y1, x2, y2, x3, y3)"), or missing ";"', pos: position + totalPosition + drawMatch[0].length, line: instructionSetStartLine + lineNumber + 2 });
                            }
                            break;
                        }
                        case 'draw.fillTriangle': {
                            const fillTriangleMatch = section.substr(position).match(/^draw\.fillTriangle\(( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *),( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *),( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *),( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *),( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *),( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *),( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *)\)END_OF_SECTION$/g);
                            if (fillTriangleMatch) {
                                const params = fillTriangleMatch[0].replace(/\s/g, '').replace('draw.fillTriangle(', '').replace(')END_OF_SECTION', '').split(',');
                                drawInstruction.type = instruction_1.InstructionType.FillTriangle;
                                drawInstruction.params = params;
                            }
                            else {
                                result.errors.push({ error: 'Unexpected draw.fillTriangle format ("draw.fillTriangle(color, x1, y1, x2, y2, x3, y3)"), or missing ";"', pos: position + totalPosition + drawMatch[0].length, line: instructionSetStartLine + lineNumber + 2 });
                            }
                            break;
                        }
                        case 'draw.drawLine': {
                            const drawLineMatch = section.substr(position).match(/^draw\.drawLine\(( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *),( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *),( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *),( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *),( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *)\)END_OF_SECTION$/g);
                            if (drawLineMatch) {
                                const params = drawLineMatch[0].replace(/\s/g, '').replace('draw.drawLine(', '').replace(')END_OF_SECTION', '').split(',');
                                drawInstruction.type = instruction_1.InstructionType.DrawLine;
                                drawInstruction.params = params;
                            }
                            else {
                                result.errors.push({ error: 'Unexpected draw.drawLine format ("draw.drawLine(color, x1, y1, x2, y2)"), or missing ";"', pos: position + totalPosition + drawMatch[0].length, line: instructionSetStartLine + lineNumber + 2 });
                            }
                            break;
                        }
                        case 'draw.setRotation': {
                            const setRotationMatch = section.substr(position).match(/^draw\.setRotation\(( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *)\)END_OF_SECTION$/g);
                            if (setRotationMatch) {
                                const params = setRotationMatch[0].replace(/\s/g, '').replace('draw.setRotation(', '').replace(')END_OF_SECTION', '').split(',');
                                drawInstruction.type = instruction_1.InstructionType.SetRotation;
                                drawInstruction.params = params;
                            }
                            else {
                                result.errors.push({ error: 'Unexpected draw.setRotation format ("draw.setRotation(rotation)"), or missing ";"', pos: position + totalPosition + drawMatch[0].length, line: instructionSetStartLine + lineNumber + 2 });
                            }
                            break;
                        }
                    }
                    const actualParams = [];
                    drawInstruction.params.forEach((p, i) => {
                        const parsedParam = Number.parseFloat(p);
                        if (!Number.isNaN(parsedParam)) {
                            const subParamName = name + (instructionSetStartLine + lineNumber + 2) + '-param-' + i;
                            result.values.push({
                                name: subParamName,
                                type: value_1.ValueType.number,
                                value: parsedParam,
                                line: instructionSetStartLine + lineNumber + 2,
                                pos: position + totalPosition
                            });
                            actualParams.push(subParamName);
                        }
                        else {
                            actualParams.push(p);
                        }
                    });
                    drawInstruction.params = actualParams;
                    result.instructions.push(drawInstruction);
                }
                else {
                    result.errors.push({ error: 'Unexpected draw type', pos: position + totalPosition, line: instructionSetStartLine + lineNumber + 2 });
                }
            }
            else if (executeMatch) {
                const executeMatchFormat = section.substr(position).match(/^(await( +?))?execute\(( *)(([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)( *)\)END_OF_SECTION$/g);
                if (executeMatchFormat) {
                    const await = section.substr(position).startsWith('await');
                    const func = executeMatchFormat[0].replace(/\s/g, '').replace('await', '').replace(/\s/g, '').replace('execute(', '').replace(')END_OF_SECTION', '');
                    result.instructions.push({
                        type: instruction_1.InstructionType.RunSet,
                        params: [func],
                        line: instructionSetStartLine + lineNumber + 2,
                        pos: position + totalPosition,
                        await
                    });
                    if (await && !async) {
                        result.errors.push({ error: 'Cannot use await in function that is not asynchronous', pos: position + totalPosition + executeMatch[0].length, line: instructionSetStartLine + lineNumber + 2 });
                    }
                }
                else {
                    result.errors.push({ error: 'Unexpected execute format ("execute(myFunction)" or "await execute(myFunction)"), or missing ";"', pos: position + totalPosition + executeMatch[0].length, line: instructionSetStartLine + lineNumber + 2 });
                }
            }
            else if (toneMatch) {
                const toneMatchFormat = section.substr(position).match(/^(await( +?))?tone\(( *)(([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)( *),( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *),( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *),( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *)\)END_OF_SECTION$/g);
                if (toneMatchFormat) {
                    const await = section.substr(position).startsWith('await');
                    const params = toneMatchFormat[0].replace(/\s/g, '').replace('await', '').replace(/\s/g, '').replace('tone(', '').replace(')END_OF_SECTION', '').split(',');
                    const actualParams = [];
                    params.forEach((p, i) => {
                        const parsedParam = Number.parseFloat(p);
                        if (!Number.isNaN(parsedParam)) {
                            const subParamName = 'tone - ' + name + (instructionSetStartLine + lineNumber + 2) + '-param-' + i;
                            result.values.push({
                                name: subParamName,
                                type: value_1.ValueType.number,
                                value: parsedParam,
                                line: instructionSetStartLine + lineNumber + 2,
                                pos: position + totalPosition
                            });
                            actualParams.push(subParamName);
                        }
                        else {
                            actualParams.push(p);
                        }
                    });
                    result.instructions.push({
                        type: instruction_1.InstructionType.Tone,
                        params: actualParams,
                        line: instructionSetStartLine + lineNumber + 2,
                        pos: position + totalPosition,
                        await
                    });
                    if (await && !async) {
                        result.errors.push({ error: 'Cannot use await in function that is not asynchronous', pos: position + totalPosition + toneMatch[0].length, line: instructionSetStartLine + lineNumber + 2 });
                    }
                }
                else {
                    result.errors.push({ error: 'Unexpected tone format ("tone(mySpeaker, myVolume, myFrequency, myDuration)" or "await tone(mySpeaker, myVolume, myFrequency, myDuration)"), or missing ";"', pos: position + totalPosition + toneMatch[0].length, line: instructionSetStartLine + lineNumber + 2 });
                }
            }
            else if (debugMatch) {
                const debugMatchFormat = section.substr(position).match(/^log\(( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *)\)END_OF_SECTION$/g);
                if (debugMatchFormat) {
                    const debugName = 'debug -' + name + '-' + (instructionSetStartLine + lineNumber + 2) + '-' + (position + totalPosition + debugMatch[0].length);
                    let value = debugMatchFormat[0].replace(/\s/g, '').replace('log(', '').replace(')END_OF_SECTION', '');
                    const parsedValue = Number.parseFloat(value);
                    if (!Number.isNaN(parsedValue)) {
                        const subValueName = debugName + '-value';
                        result.values.push({
                            name: subValueName,
                            type: value_1.ValueType.number,
                            value: parsedValue,
                            line: instructionSetStartLine + lineNumber + 2,
                            pos: position + totalPosition
                        });
                        value = subValueName;
                    }
                    result.instructions.push({
                        type: instruction_1.InstructionType.DebugLog,
                        params: [value],
                        line: instructionSetStartLine + lineNumber + 2,
                        pos: position + totalPosition,
                        await: false
                    });
                }
                else {
                    result.errors.push({ error: 'Unexpected log format ("log(myValue)"), or missing ";"', pos: position + totalPosition + debugMatch[0].length, line: instructionSetStartLine + lineNumber + 2 });
                }
            }
            else if (waitMatch) {
                const waitMatchFormat = section.substr(position).match(/^wait\(( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *)\)END_OF_SECTION$/g);
                if (waitMatchFormat) {
                    const waitName = 'wait -' + name + '-' + (instructionSetStartLine + lineNumber + 2) + '-' + (position + totalPosition + waitMatch[0].length);
                    let value = waitMatchFormat[0].replace(/\s/g, '').replace('wait(', '').replace(')END_OF_SECTION', '');
                    const parsedValue = Number.parseFloat(value);
                    if (!Number.isNaN(parsedValue)) {
                        const subValueName = waitName + '-value';
                        result.values.push({
                            name: subValueName,
                            type: value_1.ValueType.number,
                            value: parsedValue,
                            line: instructionSetStartLine + lineNumber + 2,
                            pos: position + totalPosition
                        });
                        value = subValueName;
                    }
                    result.instructions.push({
                        type: instruction_1.InstructionType.Wait,
                        params: [value],
                        line: instructionSetStartLine + lineNumber + 2,
                        pos: position + totalPosition,
                        await: false
                    });
                }
                else {
                    result.errors.push({ error: 'Unexpected wait format ("wait(myValue)"), or missing ";"', pos: position + totalPosition + waitMatch[0].length, line: instructionSetStartLine + lineNumber + 2 });
                }
            }
            else if (mutateMatch) {
                const evalMatch = section.substr(position).match(/^(([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)( *)=( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *)(\+|-|\*|\/|%|&|\||\^|<<|>>|pow|==|!=|>|<|>=|<=)( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))END_OF_SECTION$/g);
                const numberMatch = section.substr(position).match(/^(([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)( *)=( *)((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+))))END_OF_SECTION$/g);
                const valueMatch = section.substr(position).match(/^(([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)( *)=( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))END_OF_SECTION$/g);
                if (evalMatch) {
                    const valueSplit = evalMatch[0].replace(/\s/g, '').replace('END_OF_SECTION', '').split(/=(.+)/g);
                    const value = valueSplit[1];
                    const valueName = valueSplit[0];
                    const evaluation = value.match(/(\+|-|\*|\/|%|&|\||\^|<<|>>|pow|==|!=|>=|<=|>|<)/g)[0];
                    const values = value.split(evaluation);
                    let evaluationType = getEvaluationOperator(evaluation);
                    const evaluationValueName = valueName + '-' + name + '-' + (instructionSetStartLine + lineNumber + 2) + '-' + (position + totalPosition + mutateMatch[0].length);
                    let left = values[0];
                    let right = values[1];
                    const parsedLeft = Number.parseFloat(left);
                    if (!Number.isNaN(parsedLeft)) {
                        const subLeftName = evaluationValueName + '-left';
                        result.values.push({
                            name: subLeftName,
                            type: value_1.ValueType.number,
                            value: parsedLeft,
                            line: instructionSetStartLine + lineNumber + 2,
                            pos: position + totalPosition
                        });
                        left = subLeftName;
                    }
                    const parsedRight = Number.parseFloat(right);
                    if (!Number.isNaN(parsedRight)) {
                        const subRightName = evaluationValueName + '-right';
                        result.values.push({
                            name: subRightName,
                            type: value_1.ValueType.number,
                            value: parsedRight,
                            line: instructionSetStartLine + lineNumber + 2,
                            pos: position + totalPosition
                        });
                        right = subRightName;
                    }
                    result.values.push({
                        name: evaluationValueName,
                        type: value_1.ValueType.evaluation,
                        value: {
                            evaluation: evaluationType,
                            left,
                            right,
                            static: false
                        },
                        line: instructionSetStartLine + lineNumber + 2,
                        pos: position + totalPosition
                    });
                    result.instructions.push({
                        type: instruction_1.InstructionType.MutateValue,
                        params: [valueName, evaluationValueName],
                        line: instructionSetStartLine + lineNumber + 2,
                        pos: position + totalPosition,
                        await: false
                    });
                }
                else if (numberMatch) {
                    const valueSplit = numberMatch[0].replace(/\s/g, '').replace('END_OF_SECTION', '').split(/=(.+)/g);
                    const value = valueSplit[1];
                    const valueName = valueSplit[0];
                    const numberValueName = valueName + '-' + name + '-' + (instructionSetStartLine + lineNumber + 2) + '-' + (position + totalPosition + mutateMatch[0].length);
                    result.values.push({
                        type: value_1.ValueType.number,
                        value: value,
                        name: numberValueName,
                        line: instructionSetStartLine + lineNumber + 2,
                        pos: position + totalPosition
                    });
                    result.instructions.push({
                        type: instruction_1.InstructionType.MutateValue,
                        params: [valueName, numberValueName],
                        line: instructionSetStartLine + lineNumber + 2,
                        pos: position + totalPosition,
                        await: false
                    });
                }
                else if (valueMatch) {
                    const valueSplit = valueMatch[0].replace(/\s/g, '').replace('END_OF_SECTION', '').split(/=(.+)/g);
                    const value = valueSplit[1];
                    const valueName = valueSplit[0];
                    result.instructions.push({
                        type: instruction_1.InstructionType.MutateValue,
                        params: [valueName, value],
                        line: instructionSetStartLine + lineNumber + 2,
                        pos: position + totalPosition,
                        await: false
                    });
                }
                else {
                    result.errors.push({ error: 'Incorrect evaluation/number format or missing ";"', pos: position + totalPosition + mutateMatch[0].length, line: instructionSetStartLine + lineNumber + 2 });
                }
            }
            else if (conditionMatch) {
                const conditionValueMatch = section.substr(position).match(/^if( *)\(( *)(([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)( *)\)( *){END_OF_SECTION$/g);
                const conditionEvalMatch = section.substr(position).match(/^if( *)\(( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *)(\+|-|\*|\/|%|&|\||\^|<<|>>|pow|==|!=|>|<|>=|<=)( *)((([a-z]|[A-Z])+([a-z]|[A-Z]|[0-9])*)|((-?)(([0-9]+(\.([0-9]+))?)|(\.([0-9]+)))))( *)\)( *){END_OF_SECTION$/g);
                let functionLineNumber = lineNumber;
                let conditionInstructionSetSucceedName = 'if-succeed-' + name + '-' + (instructionSetStartLine + lineNumber + 2) + '-' + (position + totalPosition + conditionMatch[0].length);
                let conditionInstructionSetFailedName = '';
                let conditionEvaluationName = '';
                let ifLength = 0;
                if (conditionValueMatch) {
                    conditionEvaluationName = conditionValueMatch[0].replace(/\s/g, '').replace('if(', '').replace('){END_OF_SECTION', '');
                }
                else if (conditionEvalMatch) {
                    const value = conditionEvalMatch[0].replace(/\s/g, '').replace('if(', '').replace('){END_OF_SECTION', '');
                    const evaluation = value.match(/(\+|-|\*|\/|%|&|\||\^|<<|>>|pow|==|!=|>=|<=|>|<)/g)[0];
                    const values = value.split(evaluation);
                    let evaluationType = getEvaluationOperator(evaluation);
                    conditionEvaluationName = name + '-' + (instructionSetStartLine + lineNumber + 2) + '-' + (position + totalPosition + conditionMatch[0].length);
                    let left = values[0];
                    let right = values[1];
                    const parsedLeft = Number.parseFloat(left);
                    if (!Number.isNaN(parsedLeft)) {
                        const subLeftName = conditionEvaluationName + '-left';
                        result.values.push({
                            name: subLeftName,
                            type: value_1.ValueType.number,
                            value: parsedLeft,
                            line: instructionSetStartLine + lineNumber + 2,
                            pos: position + totalPosition
                        });
                        left = subLeftName;
                    }
                    const parsedRight = Number.parseFloat(right);
                    if (!Number.isNaN(parsedRight)) {
                        const subRightName = conditionEvaluationName + '-right';
                        result.values.push({
                            name: subRightName,
                            type: value_1.ValueType.number,
                            value: parsedRight,
                            line: instructionSetStartLine + lineNumber + 2,
                            pos: position + totalPosition
                        });
                        right = subRightName;
                    }
                    result.values.push({
                        name: conditionEvaluationName,
                        type: value_1.ValueType.evaluation,
                        value: {
                            evaluation: evaluationType,
                            left,
                            right,
                            static: false
                        },
                        line: instructionSetStartLine + lineNumber + 2,
                        pos: position + totalPosition,
                    });
                }
                else {
                    result.errors.push({ error: 'Incorrect condition format', pos: position + totalPosition + conditionMatch[0].length, line: instructionSetStartLine + lineNumber + 2 });
                }
                let functionLines = [];
                let functionCodeLine = line.trim();
                let level = 1;
                let continueSearch = true;
                while (continueSearch) {
                    if (functionLineNumber + 1 < lines.length) {
                        functionLineNumber++;
                        functionCodeLine = lines[functionLineNumber];
                        if (functionCodeLine.includes('{') && !(level === 1 && functionCodeLine.includes('else'))) {
                            level++;
                        }
                        if (functionCodeLine.includes('}')) {
                            level--;
                        }
                        if (level > 0) {
                            functionLines[parsedLinesCount - 1] = functionCodeLine;
                        }
                        else {
                            continueSearch = false;
                        }
                        ifLength++;
                        parsedLinesCount++;
                    }
                    else {
                        continueSearch = false;
                    }
                }
                const conditionSuccessInstructions = parseInstructionSet(instructionSetStartLine + lineNumber + 1, functionLines, conditionInstructionSetSucceedName, async);
                resultList.push(...conditionSuccessInstructions);
                if (functionLineNumber + 1 < lines.length) {
                    let elseLine = lines[functionLineNumber];
                    elseLine += 'END_OF_SECTION';
                    let position = 0;
                    let char = elseLine.charAt(position);
                    while (char.match(/\s/g)) {
                        position++;
                        char = elseLine.charAt(position);
                    }
                    const conditionElseMatch = elseLine.substr(position).match(/^}( *)else( *){END_OF_SECTION$/g);
                    if (conditionElseMatch) {
                        conditionInstructionSetFailedName = 'if-failed-' + name + '-' + (instructionSetStartLine + lineNumber + 2) + '-' + (position + totalPosition + conditionMatch[0].length);
                        let functionLines = [];
                        let functionCodeLine = line.trim();
                        let level = 1;
                        let continueSearch = true;
                        while (continueSearch) {
                            if (functionLineNumber + 1 < lines.length) {
                                functionLineNumber++;
                                functionCodeLine = lines[functionLineNumber];
                                if (functionCodeLine.includes('{')) {
                                    level++;
                                }
                                if (functionCodeLine.includes('}')) {
                                    level--;
                                }
                                if (level > 0) {
                                    functionLines.push(functionCodeLine);
                                }
                                else {
                                    continueSearch = false;
                                }
                                parsedLinesCount++;
                            }
                            else {
                                continueSearch = false;
                            }
                        }
                        const conditionFailedInstructions = parseInstructionSet(instructionSetStartLine + lineNumber + 1 + ifLength, functionLines, conditionInstructionSetFailedName, async);
                        resultList.push(...conditionFailedInstructions);
                    }
                }
                result.instructions.push({
                    type: instruction_1.InstructionType.RunCondition,
                    params: [conditionEvaluationName, conditionInstructionSetSucceedName, conditionInstructionSetFailedName],
                    line: instructionSetStartLine + lineNumber + 2,
                    pos: position + totalPosition,
                    await: async
                });
            }
            else {
                let s = section.substr(position).replace('END_OF_SECTION', '');
                if (s.length > 0) {
                    if (s.length > 20) {
                        s = s.substr(0, 17) + '...';
                    }
                    result.errors.push({ error: `Unexpected token "${s}"`, pos: position + totalPosition, line: instructionSetStartLine + lineNumber + 2 });
                }
            }
            totalPosition += section.replace('END_OF_SECTION', '').length + 1;
        });
        lineNumber += parsedLinesCount;
    }
    resultList.push(result);
    return resultList;
}
function getEvaluationOperator(type) {
    switch (type) {
        case '+': return evaluationValue_1.EvaluationOperator.add;
        case '-': return evaluationValue_1.EvaluationOperator.sub;
        case '*': return evaluationValue_1.EvaluationOperator.mul;
        case '/': return evaluationValue_1.EvaluationOperator.subdiv;
        case '%': return evaluationValue_1.EvaluationOperator.mod;
        case '&': return evaluationValue_1.EvaluationOperator.b_and;
        case '|': return evaluationValue_1.EvaluationOperator.b_or;
        case '^': return evaluationValue_1.EvaluationOperator.b_xor;
        case '<<': return evaluationValue_1.EvaluationOperator.lsh;
        case '>>': return evaluationValue_1.EvaluationOperator.rsh;
        case 'pow': return evaluationValue_1.EvaluationOperator.pow;
        case '==': return evaluationValue_1.EvaluationOperator.eq;
        case '!=': return evaluationValue_1.EvaluationOperator.ne;
        case '>': return evaluationValue_1.EvaluationOperator.gt;
        case '<': return evaluationValue_1.EvaluationOperator.lt;
        case '>=': return evaluationValue_1.EvaluationOperator.ge;
        case '<=': return evaluationValue_1.EvaluationOperator.le;
    }
    return -1;
}
function getSystemConfigType(value) {
    switch (value) {
        case 'ScreenHeight': return systemConfig_1.SystemConfigType.screenHeight;
        case 'ScreenWidth': return systemConfig_1.SystemConfigType.screenWidth;
        case 'CurrentMillis': return systemConfig_1.SystemConfigType.currentMillis;
        case 'IsZigZag': return systemConfig_1.SystemConfigType.isZigZag;
    }
    return -1;
}
//# sourceMappingURL=parseFunctions.js.map