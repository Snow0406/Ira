import { Client, GatewayIntentBits } from "discord.js";
import { registerSlashCommands } from "./handlers/commandHandler";
import { setupEventHandlers } from "./handlers/eventHandler";
import "dotenv/config";

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

(async () => {
    await registerSlashCommands();
    setupEventHandlers(client);
    await client.login(process.env.DISCORD_APP_TOKEN);
})();