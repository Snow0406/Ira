"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const NewAnimeHandler_1 = require("../../../modules/anime/newAnime/NewAnimeHandler");
class NewAniCommand {
    com = {
        name: "newani",
        description: "애니 신작 목록을 가져옵니다 !"
    };
    async execute(interaction) {
        const pageData = await NewAnimeHandler_1.newAnimeHandler.fetchPage();
        if (!pageData) {
            await interaction.reply({
                content: '* NewAnimeHandler fetchPage Error',
            });
            return;
        }
        const data = NewAnimeHandler_1.newAnimeHandler.parseHTML(pageData);
        if (data.detail.length === 0) {
            await interaction.reply({
                content: '* NewAnimeHandler parseHTML Error',
            });
            return;
        }
        const listString = data.detail
            .map((item, index) => {
            const extra = item.original ? `\n- ${item.original}` : "";
            return `- ${index + 1}. ${item.title}\n${'```'}- 제작사: ${item.studio}\n- 방영일: ${item.date}${extra}${'```'}`;
        })
            .join("\n\n");
        const embed = new discord_js_1.EmbedBuilder()
            .setColor("#83b3f6")
            .setTitle(`[ ${data.date} ]`)
            .setDescription(listString)
            .setFooter({
            text: interaction.user.tag,
            iconURL: interaction.user.avatarURL() || undefined,
        })
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    }
}
exports.default = NewAniCommand;
