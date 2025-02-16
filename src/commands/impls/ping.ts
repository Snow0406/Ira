import { type CommandInteraction, EmbedBuilder } from "discord.js";
import type { Command, CommandMetadata } from "../../types";

export default class PingCommand implements Command {
    com: CommandMetadata = {
        name: "ping",
        description: "Ping Pong !"
    };

    async execute(interaction: CommandInteraction) {
        const embed = new EmbedBuilder()
            .setColor("#83b3f6")
            .setTitle("Pong !")
            .setFooter({
                text: interaction.user.tag,
                iconURL: interaction.user.avatarURL() || undefined,
            })
            .setTimestamp();
        await interaction.reply({embeds: [embed]});
    }
}