"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const commandHandler_1 = require("./handlers/commandHandler");
const eventHandler_1 = require("./handlers/eventHandler");
require("dotenv/config");
const client = new discord_js_1.Client({
    intents: [discord_js_1.GatewayIntentBits.Guilds]
});
(async () => {
    await (0, commandHandler_1.registerSlashCommands)();
    (0, eventHandler_1.setupEventHandlers)(client);
    await client.login(process.env.DISCORD_APP_TOKEN);
})();
