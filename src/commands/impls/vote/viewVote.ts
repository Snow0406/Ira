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
                name: "index",
                description: "0: 1등 투표 목록, 1: 2등 투표 목록, 2: 3등 투표 목록",
                required: true,
                type: ApplicationCommandOptionType.Number
            }
        ]
    };

    async execute(interaction: CommandInteraction) {
        if (!interaction.memberPermissions?.has("Administrator")) {
            await interaction.reply({
                content: '관리자만 사용할 수 있는 명령어입니다.',
            });
            return;
        }

        const index = interaction.options.get("index")?.value as number;

        const data: Result = voteStore.getVoteResult(index);

        if (!data.type) {
            const embed = new EmbedBuilder()
                .setColor("#fd0909")
                .setTitle("웨루게임잼 RE:개발살던놈들 Vote")
                .setDescription(data.content.toString())
                .setFooter({
                    text: interaction.user.tag,
                    iconURL: interaction.user.avatarURL() || undefined,
                })
                .setTimestamp();
            await interaction.reply({embeds: [embed] });
            return;
        }

        const result: string[] = Object.entries(data.content).map((s, i) => `− ${i+1}등: ${s}명`);

        const embed = new EmbedBuilder()
            .setColor("#83b3f6")
            .setTitle("웨루게임잼 RE:개발살던놈들 Vote")
            .setDescription(result.join("\n"))
            .setFooter({
                text: interaction.user.tag,
                iconURL: interaction.user.avatarURL() || undefined,
            })
            .setTimestamp();
        await interaction.reply({embeds: [embed] });
    }
}
