import os
import discord
from discord.ext import commands
from dotenv import load_dotenv

load_dotenv()

TOKEN = os.getenv("DISCORD_TOKEN")

intents = discord.Intents.default()

bot = commands.Bot(
    command_prefix="!",
    intents=intents
)

@bot.event
async def on_ready():
    print(f"Logged in as {bot.user}")

@bot.tree.command(name="quasar")
async def quasar(interaction: discord.Interaction):
    await interaction.response.send_message(
        "🌌 Quasar OS is online!"
    )

bot.run(TOKEN)