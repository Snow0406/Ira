"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allCommands = void 0;
const utils_1 = require("./utils");
// @ts-ignore
const node_path_1 = require("node:path");
// @ts-ignore
const fast_glob_1 = require("fast-glob");
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
        const imported = await Promise.resolve(`${modulePath}`).then(s => require(s));
        // 기본적으로 default export된 클래스를 인스턴스화 함
        return new imported.default();
    }));
    return (0, utils_1.filterAllCommands)(commands);
}
// 최종 결과 promise를 export합니다.
exports.allCommands = loadAllCommands();
