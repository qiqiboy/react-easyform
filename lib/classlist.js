'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (classObj) {
    if (Array.isArray(classObj)) {
        return classObj.join(' ');
    }
    return Object.keys(classObj).filter(function (name) {
        return !!classObj[name];
    }).join(' ');
};