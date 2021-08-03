"use strict";

var ext = require('./js/extension');

function activate(ctx) {
    console.log('Activating AngularDoc extension...');
    ext.activate(ctx);
}
exports.activate = activate;