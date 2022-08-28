"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rules = void 0;
const no_inferrable_parameter_types_1 = require("./rules/no-inferrable-parameter-types");
exports.rules = {
    "no-inferrable-parameter-types": no_inferrable_parameter_types_1.rule,
};
