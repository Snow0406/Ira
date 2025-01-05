// 웨루게임잼 RE:개발살던놈들에서 사용할 투표 기능

import { ApplicationCommandOptionType, ColorResolvable, type CommandInteraction, EmbedBuilder } from "discord.js";
import type { Command, CommandMetadata, Result } from "@src/types";
import { voteStore } from "@src/modules/voteStore";

// 투표 추가
export default class VoteCommand implements Command {
    com: CommandMetadata = {
        name: "vote",
        description: "1등, 2등, 3등을 투표하세요 !\n* 웨루게임잼 RE:개발살던놈들 전용 기능",
        option: [
            {
                name: "1st_place",
                description: "1등",
                required: true,
                type: ApplicationCommandOptionType.Number
            },
            {
                name: "2st_place",
                description: "2등",
                required: true,
                type: ApplicationCommandOptionType.Number
            },
            {
                name: "3st_place",
                description: "3등",
                required: true,
                type: ApplicationCommandOptionType.Number
            }
            ]
    };

    async execute(interaction: CommandInteraction) {
        const embedData: string[] = [];
        const data: (number | undefined)[] = [
            interaction.options.get("1st_place")?.value as number,
            interaction.options.get("2st_place")?.value as number,
            interaction.options.get("3st_place")?.value as number
        ];

        if ((!data[0] || !data[1] || !data[2]) || (data[0] === data[1] || data[1] === data[2] || data[2] === data[1])) {
            embedData[0] = "1등, 2등, 3등 중복 없이 다 입력해주세요 !";
            embedData[1] = "#fd0909";
        } else {
            const firstVote: Result = voteStore.addVote(0, interaction.user.id, data[0]);
            const secondVote: Result = voteStore.addVote(1, interaction.user.id, data[1]);
            const thirdVote: Result = voteStore.addVote(2, interaction.user.id, data[2]);

            if (!firstVote.type || !secondVote.type || !thirdVote.type) {
                embedData[1] = "#fd0909";

                if (!firstVote.type)
                    embedData[0] = firstVote.content.toString();
                else if (!secondVote.type)
                    embedData[0] = secondVote.content.toString();
                else if (!thirdVote.type)
                    embedData[0] = thirdVote.content.toString();
            } else {
                embedData[0] = firstVote.content.toString();
                embedData[1] = '#83b3f6';
            }
        }

        const embed = new EmbedBuilder()
            .setColor(embedData[1] as ColorResolvable)
            .setTitle("웨루게임잼 RE:개발살던놈들 Vote")
            .setDescription(embedData[0])
            .setFooter({
                text: interaction.user.tag,
                iconURL: interaction.user.avatarURL() || undefined,
            })
            .setTimestamp();
        await interaction.reply({embeds: [embed] });
    }
}
