"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class PingCommand {
    com = {
        name: "ping",
        description: "Ping Pong !"
    };
    async execute(interaction) {
        const embed = new discord_js_1.EmbedBuilder()
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
exports.default = PingCommand;
