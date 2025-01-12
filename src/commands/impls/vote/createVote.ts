// 웨루게임잼 RE:개발살던놈들에서 사용할 투표 기능

import { ApplicationCommandOptionType, type CommandInteraction, EmbedBuilder } from "discord.js";
import type { Command, CommandMetadata } from "@src/types";
import { voteStore } from "@src/modules/voteStore";

// 투표 추가
export default class CreateVoteCommand implements Command {
    com: CommandMetadata = {
        name: "addvote",
        description: "투표 생성\n* 웨루게임잼 RE:개발살던놈들 전용 기능",
        option: [
            {
                name: "name",
                description: "투표 이름 (예: 종합, 비주얼 등)",
                required: true,
                type: ApplicationCommandOptionType.String
            },
            {
                name: "max_option",
                description: "투표 선택지 갯수",
                required: true,
                type: ApplicationCommandOptionType.Number
            }
        ]
    };

    async execute(interaction: CommandInteraction) {
        const GAMEJAM_GUILD_ID: string = "1322585788248100884";
        if (!interaction.memberPermissions?.has("Administrator")) {
            await interaction.reply({
                content: '관리자만 사용할 수 있는 명령어입니다.',
            });
            return;
        }

        if (interaction.guildId !== GAMEJAM_GUILD_ID) {
            await interaction.reply({
                content: '해당 서버에서는 사용할 수 없는 명령어 이에요 !',
            });
            return;
        }

        const voteName = interaction.options.get("name")?.value as string;
        const data = interaction.options.get("max_option")?.value as number;

        voteStore.createVote(voteName, data);
        voteStore.createVote(voteName, data);
        voteStore.createVote(voteName, data);

        if (data < 1) {
            await interaction.reply({
                content: '0보다는 크게 해주세요 !',
            });
            return;
        }

        const embed = new EmbedBuilder()
            .setColor("#83b3f6")
            .setTitle("웨루게임잼 RE:개발살던놈들 Vote")
            .setDescription("투표 추가 완료 !")
            .addFields({ name: "후보자", value: data.toString() })
            .setFooter({
                text: interaction.user.tag,
                iconURL: interaction.user.avatarURL() || undefined,
            })
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    }
}
