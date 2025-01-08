import { Command } from "@src/types";
import { filterAllCommands } from "@src/commands/utils";
import path from "node:path";
import fg from "fast-glob";

console.log("* Init Commands");

const modules = await fg("src/commands/impls/**/*.ts", {
    onlyFiles: true,
    dot: true,
});

export const allCommands: Command[] = filterAllCommands(
    await Promise.all(
        modules.map(
            async (m) =>
                new (
                    await import(
                        `./${path.relative("src/commands", m.replace(".ts", ".js"))}`
                        )
                ).default()
        )
    )
);