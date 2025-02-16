import { Command } from "../types";
import { filterAllCommands } from "./utils";
// @ts-ignore
import path from "node:path";
// @ts-ignore
import fg from "fast-glob";

console.log("* Init Commands");

const modules = await fg("src/commands/impls/**/*.ts", {
    onlyFiles: true,
    dot: true,
});

// @ts-ignore
export const allCommands: Command[] = filterAllCommands(
    await Promise.all(
        modules.map(
            async (m: any) =>
                new (
                    await import(
                        `./${path.relative("src/commands", m.replace(".ts", ".js"))}`
                        )
                ).default()
        )
    )
);