import { Command } from "../types";
import { filterAllCommands } from "./utils";
// @ts-ignore
import path from "node:path";
// @ts-ignore
import fg from "fast-glob";

console.log("* Init Commands");

async function loadAllCommands(): Promise<Command[]> {
// 파일 목록 가져오기
    const modules = await fg("src/commands/impls/**/*.ts", {
        onlyFiles: true,
        dot: true,
    });

// 각 파일을 동적으로 import하여 인스턴스를 생성
    const commands = await Promise.all(
        modules.map(async (m: string) => {
// ts -> js로 변경 후 상대 경로 계산
            const modulePath = `./${path.relative("src/commands", m.replace(".ts", ".js"))}`;
            const imported = await import(modulePath);
// 기본적으로 default export된 클래스를 인스턴스화 함
            return new imported.default();
        })
    );

    return filterAllCommands(commands);
}

// 최종 결과 promise를 export합니다.
export const allCommands: Promise<Command[]> = loadAllCommands();