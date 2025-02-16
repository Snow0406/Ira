"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allCommands = void 0;
const utils_1 = require("./utils");
// @ts-ignore
const node_path_1 = __importDefault(require("node:path"));
// @ts-ignore
const fast_glob_1 = __importDefault(require("fast-glob"));
console.log("* Init Commands");
async function loadAllCommands() {
    // 파일 목록 가져오기
    const modules = await (0, fast_glob_1.default)("src/commands/impls/**/*.ts", {
        onlyFiles: true,
        dot: true,
    });
    // 각 파일을 동적으로 import하여 인스턴스를 생성
    const commands = await Promise.all(modules.map(async (m) => {
        // ts -> js로 변경 후 상대 경로 계산
        const modulePath = `./${node_path_1.default.relative("src/commands", m.replace(".ts", ".js"))}`;
        const imported = await Promise.resolve(`${modulePath}`).then(s => __importStar(require(s)));
        // 기본적으로 default export된 클래스를 인스턴스화 함
        return new imported.default();
    }));
    return (0, utils_1.filterAllCommands)(commands);
}
// 최종 결과 promise를 export합니다.
exports.allCommands = loadAllCommands();
