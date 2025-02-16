"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSlashCommands = registerSlashCommands;
const discord_js_1 = require("discord.js");
const commands_1 = require("../commands");
require("dotenv/config");
//? Register Slash Commands
async function registerSlashCommands() {
    const rest = new discord_js_1.REST().setToken(process.env.DISCORD_APP_TOKEN);
    try {
        const commandsData = (await commands_1.allCommands).map(cmd => buildCommand(cmd));
        const data = await rest.put(discord_js_1.Routes.applicationCommands(process.env.APP_ID), { body: commandsData });
        //@ts-expect-error data is unknown
        console.log(`* Registered total ${data.length} slash commands.`);
    }
    catch (error) {
        console.error('* Error registering commands:', error);
        process.exit(1);
    }
}
function buildCommand(cmd) {
    const command = new discord_js_1.SlashCommandBuilder()
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
        [discord_js_1.ApplicationCommandOptionType.String]: buildStringOption,
        [discord_js_1.ApplicationCommandOptionType.Number]: buildNumberOption,
        [discord_js_1.ApplicationCommandOptionType.Boolean]: buildBooleanOption
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
