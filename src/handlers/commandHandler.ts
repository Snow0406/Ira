import { ApplicationCommandOptionType, REST, Routes, SlashCommandBuilder } from "discord.js";
import { allCommands } from "@src/commands";
import { Command, CommandOption } from "@src/types";

type OptionBuilderFunction = (command: SlashCommandBuilder, option: CommandOption) => void;

//? Register Slash Commands
export async function registerSlashCommands() : Promise<void> {
    const rest = new REST().setToken(process.env.DISCORD_APP_TOKEN!);
    try {
        const commandsData = allCommands.map(cmd => buildCommand(cmd))
        const data = await rest.put(
            Routes.applicationGuildCommands(
                process.env.APP_ID!,
                process.env.GUILD_ID!
            ),
            { body: commandsData }
        );
        //@ts-expect-error data is unknown
        console.log(`* Registered total ${data.length} slash commands.`);
    } catch (error) {
        console.error('* Error registering commands:', error);
        process.exit(1);
    }
}

function buildCommand(cmd: Command) {
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

function addCommandOption(command: SlashCommandBuilder, option: CommandOption) {
    const optionBuilders: Partial<Record<ApplicationCommandOptionType, OptionBuilderFunction>> = {
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
function buildStringOption(command: SlashCommandBuilder, option: CommandOption) {
    command.addStringOption((opt: any) => {
        const commandOption = opt
            .setName(option.name)
            .setDescription(option.description)
            .setRequired(option.required)
            .setNameLocalizations(option.l10n?.name ?? null)
            .setDescriptionLocalizations(option.l10n?.description ?? null);

        if (option.choices) {
            commandOption.addChoices(
                ...option.choices.map((s: any) => ({
                    name: s.name,
                    value: s.value.toString(),
                    name_localizations: s.l10n?.name ?? null
                }))
            );
        }
        return commandOption;
    });
}

// 숫자 옵션 빌더
function buildNumberOption(command: SlashCommandBuilder, option: CommandOption) {
    command.addIntegerOption((opt: any) => {
        const commandOption = opt
            .setName(option.name)
            .setDescription(option.description)
            .setRequired(option.required)
            .setNameLocalizations(option.l10n?.name ?? null)
            .setDescriptionLocalizations(option.l10n?.description ?? null);

        if (option.choices) {
            commandOption.addChoices(
                ...option.choices.map((s: any) => ({
                    name: s.name,
                    value: +s.value,
                    name_localizations: s.l10n?.name ?? null
                }))
            );
        }
        return commandOption;
    });
}

// 불리언 옵션 빌더
function buildBooleanOption(command: SlashCommandBuilder, option: CommandOption) {
    command.addBooleanOption((opt: any) =>
        opt
            .setName(option.name)
            .setDescription(option.description)
            .setRequired(option.required)
            .setNameLocalizations(option.l10n?.name ?? null)
            .setDescriptionLocalizations(option.l10n?.description ?? null)
    );
}

//#endregion