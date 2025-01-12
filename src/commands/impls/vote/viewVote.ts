// 웨루게임잼 RE:개발살던놈들에서 사용할 투표 기능

import { ApplicationCommandOptionType, type CommandInteraction, EmbedBuilder } from "discord.js";
import type {Command, CommandMetadata, Result} from "@src/types";
import { voteStore } from "@src/modules/voteStore";

// 투표 추가
export default class ViewVoteCommand implements Command {
    com: CommandMetadata = {
        name: "viewvote",
        description: "투표 결과\n* 웨루게임잼 RE:개발살던놈들 전용 기능",
        option: [
            {
                name: "name",
                description: "투표 이름 (예: 종합, 비주얼 등)",
                required: true,
                type: ApplicationCommandOptionType.String
            },
            {
                name: "index",
                description: "0: 1등 투표 목록, 1: 2등 투표 목록, 2: 3등 투표 목록",
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
        const index = interaction.options.get("index")?.value as number;
        const data: Result = voteStore.getVoteResult(voteName, index);

        if (!data.type) {
            await interaction.reply({
                content: data.content.toString(),
            });
            return;
        }

        const embed = new EmbedBuilder()
            .setColor("#83b3f6")
            .setTitle("웨루게임잼 RE:개발살던놈들 Vote")
            .addFields({
                name: `${voteName}의 ${index+1}등 투표 랭킹`,
                value: ((data.content as string[]).join("\n") || "정보 없음")
            })
            .setFooter({
                text: interaction.user.tag,
                iconURL: interaction.user.avatarURL() || undefined,
            })
            .setTimestamp();
        await interaction.reply({embeds: [embed]});
    }
}
