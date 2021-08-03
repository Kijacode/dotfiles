"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 获得格式化时间
function getFormatDate(rule = 'YYYY-MM-DD hh:mm:ss', date) {
    let _str = rule;
    if (date === '' || date === undefined || date === null) {
        return '';
    }
    const _type = typeof date;
    if ((_type === 'string' || _type === 'number')) {
        date = new Date(+date);
    }
    const _regList = [{
            reg: /YYYY/,
            func: 'getFullYear',
        }, {
            reg: /MM/,
            func: 'getMonth',
            add: 1,
        }, {
            reg: /DD/,
            func: 'getDate',
        }, {
            reg: /hh/,
            func: 'getHours',
        }, {
            reg: /mm/,
            func: 'getMinutes',
        }, {
            reg: /ss/,
            func: 'getSeconds',
        }];
    const dateAsAny = date;
    _regList.forEach(o => {
        const { reg, func } = o;
        if (reg.test(rule)) {
            _str = _str.replace(reg, `${dateAsAny[func]() + (o.add ? o.add : 0)}`.padStart(2, '0'));
        }
    });
    return _str;
}
exports.getFormatDate = getFormatDate;
//# sourceMappingURL=date.js.map