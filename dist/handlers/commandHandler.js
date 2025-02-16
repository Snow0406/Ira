import { ApplicationCommandOptionType, REST, Routes, SlashCommandBuilder } from "discord.js";
import { allCommands } from "../commands";
import "dotenv/config";
//? Register Slash Commands
export async function registerSlashCommands() {
    const rest = new REST().setToken(process.env.DISCORD_APP_TOKEN);
    try {
        const commandsData = allCommands.map(cmd => buildCommand(cmd));
        const data = await rest.put(Routes.applicationCommands(process.env.APP_ID), { body: commandsData });
        //@ts-expect-error data is unknown
        console.log(`* Registered total ${data.length} slash commands.`);
    }
    catch (error) {
        console.error('* Error registering commands:', error);
        process.exit(1);
    }
}
function buildCommand(cmd) {
    const command = new SlashCommandBuilder()
        .setName(cmd.com.name)
        .setNameLocalizations(cmd.com.l10n?.name ?? null)
        .setDescription(cmd.com.description)
        .setDescriptionLocalizations(cmd.com.l10n?.description ?? null);
    if (cmd.com.option)
        cmd.com.option.forEach((option) => addCommandOption(command, option));
    return {
        ...command,
        type: 1
    };
}
function addCommandOption(command, option) {
    const optionBuilders = {
        [ApplicationCommandOptionType.String]: buildStringOption,
        [ApplicationCommandOptionType.Number]: buildNumberOption,
        [ApplicationCommandOptionType.Boolean]: buildBooleanOption
    };
    const builder = optionBuilders[option.type];
    if (builder) {
        builder(command, option);
    }
}
//#region CommandOption (String, Number, Boolean)
// 문자열 옵션 빌더
function buildStringOption(command, option) {
    command.addStringOption((opt) => {
        const commandOption = opt
            .setName(option.name)
            .setDescription(option.description || "-")
            .setRequired(option.required)
            .setNameLocalizations(option.l10n?.name ?? null)
            .setDescriptionLocalizations(option.l10n?.description ?? null);
        if (option.choices) {
            commandOption.addChoices(...option.choices.map((s) => ({
                name: s.name,
                value: s.value.toString(),
                name_localizations: s.l10n?.name ?? null
            })));
        }
        return commandOption;
    });
}
// 숫자 옵션 빌더
function buildNumberOption(command, option) {
    command.addIntegerOption((opt) => {
        const commandOption = opt
            .setName(option.name)
            .setDescription(option.description || "-")
            .setRequired(option.required)
            .setNameLocalizations(option.l10n?.name ?? null)
            .setDescriptionLocalizations(option.l10n?.description ?? null);
        if (option.choices) {
            commandOption.addChoices(...option.choices.map((s) => ({
                name: s.name,
                value: +s.value,
                name_localizations: s.l10n?.name ?? null
            })));
        }
        return commandOption;
    });
}
// 불리언 옵션 빌더
function buildBooleanOption(command, option) {
    command.addBooleanOption((opt) => opt
        .setName(option.name)
        .setDescription(option.description || "-")
        .setRequired(option.required)
        .setNameLocalizations(option.l10n?.name ?? null)
        .setDescriptionLocalizations(option.l10n?.description ?? null));
}
//#endregion
