"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const shell = __importStar(require("shelljs"));
shell.mkdir("-p", "dist/public");
shell.cp("-R", "src/public/css", "dist/public/css/");
shell.cp("-R", "src/public/images", "dist/public");
shell.cp("-R", "src/public/js", "dist/public/js");
