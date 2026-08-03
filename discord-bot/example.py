import os
import discord
from discord import app_commands
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
    synced = await bot.tree.sync()
    print(f"Synced {len(synced)} command(s)")
    print(f"Logged in as {bot.user}")

@bot.tree.command(name="q")
async def quasar(interaction: discord.Interaction):
    embed = discord.Embed(
        title="🌌 Quasar OS",
        description="Development Build",
        color=0x0077FF
    )

    file = discord.File(
        "assets/quasar-logo.png",
        filename="quasar-logo.png"
    )
    earth_file = discord.File(
        "assets/earth.jpg",
        filename="earth.jpg"
    )

    embed.set_thumbnail(
        url="attachment://quasar-logo.png"
    )

    embed.add_field(
        name="Status",
        value="Online",
        inline=False
    )

    embed.add_field(
        name="Version",
        value="0.1.0",
        inline=False
    )
    embed.set_image(
        url="attachment://earth.jpg"
    )

    view = discord.ui.View()

    view.add_item(
        discord.ui.Button(
            label="Open Docs",
            emoji="📚",
            url="https://example.com",
        )
    )

    await interaction.response.send_message(embed=embed, files=[file, earth_file], view=view)

# my qos system group setup example thingy
quasaros = app_commands.Group(
    name="quasaros",
    description="Quasar OS commands"
)
devtools = app_commands.Group(
    name="devtools",
    description="Developer tools"
)
@devtools.command(
    name="wallpaper",
    description="Wallpaper tools"
)
async def wallpaper(interaction: discord.Interaction):
    await interaction.response.send_message(
        "Wallpaper tools"
    )

# Make command tree
quasaros.add_command(devtools)
bot.tree.add_command(quasaros)

bot.run(TOKEN)