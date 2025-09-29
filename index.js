require("dotenv").config();
const { Client, GatewayIntentBits, Events } = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.once(Events.ClientReady, (readyClient) => {
    console.log(`✅ Bot is ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.MessageCreate, (message) => {
    if (message.author.bot) return;

    if (message.content === "!ping") {
        message.reply("🏓 Pong!");
    }

    if (message.content === "!hello") {
        message.reply(`👋 Hello ${message.author.username}!`);
    }
});

client.on(Events.Error, (error) => {
    console.error("❌ Discord client error:", error);
});

if (!process.env.DISCORD_TOKEN) {
    console.error("❌ DISCORD_TOKEN is not set in environment variables");
    console.log("ℹ️  Please set your Discord bot token in the Secrets tab");
    process.exit(1);
}

client.login(process.env.DISCORD_TOKEN).catch((error) => {
    console.error("❌ Failed to login:", error);
    process.exit(1);
});

const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static("public"));

app.get("/api/status", (req, res) => {
    res.json({
        status: "Bot is running!",
        uptime: process.uptime(),
        guilds: client.guilds.cache.size,
        users: client.users.cache.size,
    });
});

app.get("/health", (req, res) => {
    res.json({
        status: "healthy",
        bot_ready: client.isReady(),
        uptime: process.uptime(),
    });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`🌐 Web server is running on port ${PORT}`);
    console.log(`📊 Bot status available at http://localhost:${PORT}`);
});
