 import type {
    ApplicationCommandOptionType,
    CommandInteraction,
} from "discord.js";

export interface CommandOptionChoice {
    name: string;
    value: string | number;
    l10n?: {
        name?: {
            ko?: string;
            ja?: string;
        };
    };
}

export interface CommandOption {
    name: string;
    description: string;
    required: boolean;
    type: ApplicationCommandOptionType;
    choices?: CommandOptionChoice[];
    l10n?: {
        //? if you want to add localization logic, add data to here
        name?: {
            ko?: string;
            ja?: string;
        };
        description?: {
            ko?: string;
            ja?: string;
        };
    };
}

export interface CommandMetadata {
    name: string;
    description: string;
    option?: CommandOption[];
    l10n?: {
        //? if you want to add localization logic, add data to here
        name?: {
            ko?: string;
            ja?: string;
        };
        description?: {
            ko?: string;
            ja?: string;
        };
    };
}

export interface Command {
    com: CommandMetadata;
    execute(interaction: CommandInteraction): Promise<void>;
}