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
            "It allows you to upload a compatable .js file, and then see how it would look when run by Quasar OS." \
            "If you would like read more about this feature, run `/quasaros devtools wallpaper`",
            inline=False
        )

    #send
    await interaction.response.send_message(embed=embed, file=logo)



# Make command tree

#Devtools
quasaros.add_command(devtools)

# add tree to tree
bot.tree.add_command(quasaros)

bot.run(TOKEN)