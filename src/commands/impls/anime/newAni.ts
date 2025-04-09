import {
  type CommandInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  Message,
  ButtonInteraction,
  MessageFlags,
} from "discord.js";
import type { Command, CommandMetadata } from "../../../types";
import { newAnimeHandler } from "../../../modules/anime/newAnime/NewAnimeHandler";

export default class NewAniCommand implements Command {
  com: CommandMetadata = {
    name: "newani",
    description: "애니 신작 목록을 가져옵니다 !",
  };

  async execute(interaction: CommandInteraction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    try {
      const pageData = await newAnimeHandler.fetchPage();
      if (!pageData) {
        await interaction.editReply({
          content: "* NewAnimeHandler fetchPage Error",
        });
        return;
      }

      const data = newAnimeHandler.parseHTML(pageData);
      if (data.detail.length === 0) {
        await interaction.editReply({
          content: "* NewAnimeHandler parseHTML Error",
        });
        return;
      }

      // 한 페이지당 표시할 아이템 수
      const ITEMS_PER_PAGE = 8;
      const totalPages = Math.ceil(data.detail.length / ITEMS_PER_PAGE);
      let currentPage = 0;

      const generateEmbed = (page: number) => {
        const startIdx = page * ITEMS_PER_PAGE;
        const endIdx = Math.min(startIdx + ITEMS_PER_PAGE, data.detail.length);
        const slicedItems = data.detail.slice(startIdx, endIdx);

        const listString = slicedItems
          .map((item, index) => {
            const actualIndex = startIdx + index + 1;
            const linkTitle = item.namuLink
              ? `[${item.title}](${item.namuLink})`
              : item.title;
            return `${actualIndex}. ${linkTitle}\n\`\`\`- 제작사: ${item.studio}\n- 방영일: ${item.date}\n- 원작: ${item.original}\`\`\``;
          })
          .join("\n");

        return new EmbedBuilder()
          .setColor("#83b3f6")
          .setTitle(`[ ${data.date} ]`)
          .setDescription(listString)
          .setFooter({
            text: `페이지 ${page + 1}/${totalPages} • ${interaction.user.tag}`,
            iconURL: interaction.user.avatarURL() || undefined,
          })
          .setTimestamp();
      };

      // 버튼 생성 함수
      const getButtons = (page: number) => {
        return new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId("prev")
            .setLabel("◀️")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(page === 0),
          new ButtonBuilder()
            .setCustomId("next")
            .setLabel("▶️")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(page === totalPages - 1)
        );
      };

      const embed = generateEmbed(currentPage);
      const buttons = getButtons(currentPage);

      const response = await interaction.editReply({
        embeds: [embed],
        components: [buttons],
      });

      const message = (await interaction.fetchReply()) as Message;

      const collector = message.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 5 * 60 * 1000, // 5분간 활성화
      });

      collector.on("collect", async (i: ButtonInteraction) => {
        await i.deferUpdate();

        switch (i.customId) {
          case "prev":
            currentPage = Math.max(0, currentPage - 1);
            break;
          case "next":
            currentPage = Math.min(totalPages - 1, currentPage + 1);
            break;
        }

        await i.editReply({
          embeds: [generateEmbed(currentPage)],
          components: [getButtons(currentPage)],
        });
      });

      collector.on("end", async () => {
        const disabledButtons =
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
              .setCustomId("prev")
              .setLabel("◀️")
              .setStyle(ButtonStyle.Primary)
              .setDisabled(true),
            new ButtonBuilder()
              .setCustomId("next")
              .setLabel("▶️")
              .setStyle(ButtonStyle.Primary)
              .setDisabled(true)
          );

        try {
          await message.edit({ components: [disabledButtons] });
        } catch (error) {}
      });
    } catch (error) {
      console.error("NewAniCommand 오류:", error);
      try {
        await interaction.editReply({
          content: "명령어 실행 중 오류가 발생했습니다.",
        });
      } catch (e) {}
    }
  }
}
