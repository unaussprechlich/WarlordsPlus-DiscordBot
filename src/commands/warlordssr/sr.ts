import {Command, CommandoMessage} from "discord.js-commando";
import {getWarlordsSRFromName} from "../../util/WarlordsSR";
import {MessageEmbed} from "discord.js";

module.exports = class ClearCommand extends Command {
    constructor(discordClient) {
        super(discordClient, {
            name: "sr",
            description: "Returns stats of player",
            group: "warlordssr",
            memberName: "sr",
            guildOnly: true,
            args: [
                {
                    key: "playername",
                    prompt: "The player",
                    type: "string",
                    parse: function (players: string) {
                        return players.trim().replace(" ", "")
                    },
                    validate: function (players: string) {
                        if (players.trim().replace(" ", "").match("^[a-zA-Z0-9_]{1,16}$")) {
                            return true
                        } else {
                            return "The name of the player is in the wrong format!"
                        }
                    }
                }
            ],
            throttling: {
                usages: 2,
                duration: 10
            }
        });
    }

    async run(message: CommandoMessage, {playername}) {
        try {

            const player = await getWarlordsSRFromName(playername)

            if (playername == "unaussprechlich") {
                await message.channel.send(player.playername + "'s (GOD PLAYER) SR is " + player.warlords_sr.SR)
            } else if (playername == "sumsmash") {
                await message.channel.send(player.playername + "'s (LEADERBOARD PLAYER) SR is " + player.warlords_sr.SR)
            }else if(player.warlords_hypixel.wins_blu / player.warlords_hypixel.wins_red > 1.75){
                await message.channel.send(player.playername + "'s (BOOSTED) SR is " + player.warlords_sr.SR)
            }  else {
                await message.channel.send(player.playername + "'s SR is " + player.warlords_sr.SR)
            }

        } catch (e) {
            await message.reply(e.message)
        }
        return null
    }
}
