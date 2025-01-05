import { Client, GatewayIntentBits } from "discord.js";
import { registerSlashCommands } from "@src/handlers/commandHandler";
import { setupEventHandlers } from "@src/handlers/eventHandler";

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

(async () => {
    await registerSlashCommands();
    setupEventHandlers(client);
    await client.login(process.env.DISCORD_APP_TOKEN);
})();