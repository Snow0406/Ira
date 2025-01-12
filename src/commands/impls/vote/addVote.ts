// 웨루게임잼 RE:개발살던놈들에서 사용할 투표 기능

import { ApplicationCommandOptionType, type CommandInteraction, EmbedBuilder, TextChannel } from "discord.js";
import type { Command, CommandMetadata, Result } from "@src/types";
import { voteStore } from "@src/modules/voteStore";

// 투표 추가
export default class VoteCommand implements Command {
    com: CommandMetadata = {
        name: "vote",
        description: "1등, 2등, 3등을 투표하세요 !\n* 웨루게임잼 RE:개발살던놈들 전용 기능",
        option: [
            {
                name: "name",
                description: "투표 이름 (예: 종합, 비주얼 등)",
                required: true,
                type: ApplicationCommandOptionType.String
            },
            {
                name: "1st_place",
                description: "1등",
                required: true,
                type: ApplicationCommandOptionType.Number
            },
            {
                name: "2nd_place",
                description: "2등",
                required: true,
                type: ApplicationCommandOptionType.Number
            },
            {
                name: "3rd_place",
                description: "3등",
                required: true,
                type: ApplicationCommandOptionType.Number
            }
        ]
    };

    async execute(interaction: CommandInteraction) {
        const GAMEJAM_GUILD_ID: string = "1322585788248100884";
        const BOTLOG_CHANNEL_ID: string = "1325674348421316668";

        const voteName = interaction.options.get("name")?.value as string;
        const inputData: (number | undefined)[] = [
            interaction.options.get("1st_place")?.value as number,
            interaction.options.get("2nd_place")?.value as number,
            interaction.options.get("3rd_place")?.value as number
        ];

        if (interaction.guildId !== GAMEJAM_GUILD_ID) {
            await interaction.reply({
                content: '해당 서버에서는 사용할 수 없는 명령어 이에요 !',
                flags: ["Ephemeral"]
            });
            return;
        }

        // 중복 및 undefined 체크
        if (new Set(inputData).size !== 3 || inputData.includes(undefined)) {
            await interaction.reply({
                content: '1등, 2등, 3등 중복 없이 다 입력해주세요 !',
                flags: ["Ephemeral"]
            });
            return;
        }

        const voteData: Result[] = [
            voteStore.addVote(voteName, 0, interaction.user.id, inputData[0] as number),
            voteStore.addVote(voteName, 1, interaction.user.id, inputData[1] as number),
            voteStore.addVote(voteName, 2, interaction.user.id, inputData[2] as number)
        ];

        // 실패한 데이터 처리
        if (voteData.some(vote => !vote.type)) {
            const errorContent =
                voteData.find(vote => !vote.type)?.content.toString() || '처리 중 오류가 발생했습니다.';
            await interaction.reply({
                content: errorContent,
                flags: ["Ephemeral"]
            });
            return;
        }

        const embed = new EmbedBuilder()
            .setColor("#83b3f6")
            .setTitle("웨루게임잼 RE:개발살던놈들 Vote")
            .setDescription(`${voteName} 투표 성공 !`)
            .setFooter({
                text: interaction.user.tag,
                iconURL: interaction.user.avatarURL() || undefined,
            })
            .setTimestamp();
        await interaction.reply({ embeds: [embed], flags: ["Ephemeral"] });

        const channel = interaction.client.channels.cache.get(BOTLOG_CHANNEL_ID);
        if (channel?.isTextBased()) {
            const embed = new EmbedBuilder()
                .setColor("#83b3f6")
                .setTitle("웨루게임잼 RE:개발살던놈들 Vote Log")
                .setDescription(`${voteName}의 투표\n1등: \`${inputData[0]}\`, 2등: \`${inputData[1]}\`, 3등: \`${inputData[2]}\``)
                .setFooter({
                    text: interaction.user.tag,
                    iconURL: interaction.user.avatarURL() || undefined,
                })
                .setTimestamp();
            await (channel as TextChannel).send({ embeds: [embed] });
        }
    }
}
