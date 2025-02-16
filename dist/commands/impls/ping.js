import { EmbedBuilder } from "discord.js";
export default class PingCommand {
    com = {
        name: "ping",
        description: "Ping Pong !"
    };
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor("#83b3f6")
            .setTitle("Pong !")
            .setFooter({
            text: interaction.user.tag,
            iconURL: interaction.user.avatarURL() || undefined,
        })
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    }
}
