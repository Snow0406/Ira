import { type CommandInteraction, EmbedBuilder } from "discord.js";
import type { Command, CommandMetadata } from "../../../types";
import { newAnimeHandler } from "../../../modules/anime/newAnime/NewAnimeHandler";

export default class NewAniCommand implements Command {
    com: CommandMetadata = {
        name: "newani",
        description: "애니 신작 목록을 가져옵니다 !"
    };

    async execute(interaction: CommandInteraction) {
        const pageData = await newAnimeHandler.fetchPage();
        if (!pageData) {
            await interaction.reply({
                content: '* NewAnimeHandler fetchPage Error',
            });
            return;
        }

        const data = newAnimeHandler.parseHTML(pageData);
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

        const embed = new EmbedBuilder()
            .setColor("#83b3f6")
            .setTitle(`[ ${data.date} ]`)
            .setDescription(listString)
            .setFooter({
                text: interaction.user.tag,
                iconURL: interaction.user.avatarURL() || undefined,
            })
            .setTimestamp();
        await interaction.reply({embeds: [embed]});
    }
}