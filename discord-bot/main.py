import os
import discord
from discord import app_commands
from discord.ext import commands
from dotenv import load_dotenv

# constants
QUASAR_BLUE = 0x0077FF

# Init Bot
load_dotenv()
TOKEN = os.getenv("DISCORD_TOKEN")
intents = discord.Intents.default()
bot = commands.Bot(
    command_prefix="!",
    intents=intents
)

# Bot is ready
@bot.event
async def on_ready():
    synced = await bot.tree.sync()
    print(f"Synced {len(synced)} command(s)")
    print(f"Logged in as {bot.user}")

# Make main quasaros command group
quasaros = app_commands.Group(
    name="quasaros",
    description="Quasar OS commands"
)

# create devtools subgroup, and subcommands
devtools = app_commands.Group(
    name="devtools",
    description="Developer tools"
)
#devtools about
@devtools.command(
    name="about",
    description="About the devtools"
)
async def about(interaction: discord.Interaction):
    embed = discord.Embed(
            title="Quasar OS: Developer Tools",
            description="The developer tools for Quasar OS. Below is an overview of all the tools for Quasar OS Developers",
            color=QUASAR_BLUE
        )

    # logo
    logo = discord.File("assets/quasar-logo.png", filename="quasar-logo.png")
    embed.set_thumbnail(url="attachment://quasar-logo.png")

    # wallpaper tool
    embed.add_field(
            name="The Wallpaper Tool",
            value="This is a tool for viewing & creating animated wallpapers for Quasar OS. " \
            "If you would like read more about this feature, run `/quasaros devtools wallpaper`",
            inline=False
        )

    #send
    await interaction.response.send_message(embed=embed, file=logo)
#devtools wallpaper
@devtools.command(
    name="wallpaper",
    description="View and create animated wallpapers for Quasar OS"
)
async def wallpaper(interaction: discord.Interaction):
    embed = discord.Embed(
            title="Devtools: Wallpaper Tool",
            description="The wallpappaper tool allows you to upload a custom animated wallpaper for Quasar OS as a `.js` file." \
            " If you do now know how to code, and would instead like to vibe code it, you can also download the prompt, and paste it" \
            "into any AI, and it will set up the AI to make a wallpaper.",
            color=QUASAR_BLUE
        )
    # logo
    logo = discord.File("assets/quasar-logo.png", filename="quasar-logo.png")
    embed.set_thumbnail(url="attachment://quasar-logo.png")

    # buttons
    view = discord.ui.View()
    
    view.add_item(
        discord.ui.Button(
            label="Open Tool",
            emoji="📄",
            url="https://sites.google.com/view/quasarosresources/devtools/wallpaper-tool?authuser=0",
        )
    )

    #attach prompt
    prompt = discord.File("assets/prompts/wallpaper-prompt.txt", filename="wallpaper-prompt.txt")

    await interaction.response.send_message(embed=embed, files=[logo, prompt], view=view)

# Make command tree

#Devtools
quasaros.add_command(devtools)

# add tree to tree
bot.tree.add_command(quasaros)

bot.run(TOKEN)