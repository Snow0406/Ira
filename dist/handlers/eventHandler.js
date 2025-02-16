import { Events, ActivityType, PresenceUpdateStatus } from "discord.js";
import { allCommands } from "@src/commands";
export function setupEventHandlers(client) {
    // Ready 이벤트
    client.once(Events.ClientReady, () => {
        console.log("* ready!");
        setupInitialPresence(client);
    });
    // 커맨드 처리
    client.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isCommand())
            return;
        for (const command of allCommands) {
            if (interaction.isChatInputCommand()) {
                if (command.com.name === interaction.commandName) {
                    await command.execute(interaction);
                    break;
                }
            }
        }
    });
}
function setupInitialPresence(client) {
    // 초기 상태 설정
    client.user?.setPresence({
        status: PresenceUpdateStatus.Idle,
        activities: [{
                name: "기상",
                type: ActivityType.Custom,
                state: "으으... 아직 졸려요"
            }]
    });
    // 10분 후 상태 변경 시작
    setTimeout(() => {
        const activities = [
            { name: "ナツノセ - 誰そ彼", type: ActivityType.Listening, state: "on Spotify" },
            { name: "ミセカイ - 唄を教えてくれたあなたへ", type: ActivityType.Listening, state: "on Spotify" },
            { name: "Rokudenashi - 子供騙し", type: ActivityType.Listening, state: "on Spotify" },
            { name: "Kano - いつかの約束を君に", type: ActivityType.Listening, state: "on Spotify" },
            { name: "TUYU - アサガオの散る頃に", type: ActivityType.Listening, state: "on Spotify" },
            { name: "Hoshimachi Suisei - ソワレ", type: ActivityType.Listening, state: "on Spotify" }
        ];
        // 3분마다 변경
        let currentIndex = 0;
        setInterval(() => {
            const activity = activities[currentIndex];
            client.user?.setActivity(activity.name, { type: activity.type });
            currentIndex = (currentIndex + 1) % activities.length;
        }, 180000);
        client.user?.setStatus(PresenceUpdateStatus.DoNotDisturb);
    }, 300000);
}
