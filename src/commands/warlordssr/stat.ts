import {Command, CommandoMessage} from "discord.js-commando";
import {getPreviousNames, getWarlordsSRFromName} from "../../util/WarlordsSR";
import {MessageEmbed} from "discord.js";

module.exports = class ClearCommand extends Command {
    constructor(discordClient) {
        super(discordClient, {
            name: "stat",
            description: "Returns stats of player",
            group: "warlordssr",
            aliases : ["stats", "playerstat", "playerstats"],
            memberName: "stat",
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

            await message.channel.send(new MessageEmbed()
                .setColor(15158332)
                .setThumbnail('https://crafatar.com/renders/body/' + player.uuid)
                .setURL('https://warlordssr.unaussprechlich.net/player/uuid/' + player.uuid)
                .setTitle(player.playername)
                .setDescription(getPreviousNames(player.name_history))
                .setImage('https://crafatar.com/avatars/' + player.uuid)
                .addFields(
                    // {
                    //     name: '\u200B',
                    //     value: '\u200B'
                    // },
                    {
                        name: 'Kills | Assists | Deaths',
                        value: '__K/D Ratio:__ ' + numberWithCommas(player.warlords_sr.KD) + '\n' +
                            '__K+A/D Ratio:__ ' + numberWithCommas(player.warlords_sr.KDA) + '\n' +
                            '__Kills:__ ' + numberWithCommas(player.warlords_hypixel.kills) + '\n' +
                            '__Assists:__ ' + numberWithCommas(player.warlords_hypixel.assists) + '\n' +
                            '__Deaths:__ ' + numberWithCommas(player.warlords_hypixel.deaths) + '\n',
                        inline: true
                    },
                    {
                        name: 'Damage | Heal | Prevented',
                        value: '__DHP per game:__ ' + numberWithCommas(player.warlords_sr.DHP) + '\n' +
                            '__Prevented:__ ' + numberWithCommas(player.warlords_hypixel.damage_prevented) + '\n' +
                            '__Dmg taken:__ ' + numberWithCommas(player.warlords_hypixel.damage_taken) + '\n' +
                            '__Dmg dealt:__ ' + numberWithCommas(player.warlords_hypixel.damage) + '\n' +
                            '__Healing:__ ' + numberWithCommas(player.warlords_hypixel.heal) + '\n' +
                            '__Life leeched:__ ' + numberWithCommas(player.warlords_hypixel.life_leeched) + '\n',
                        inline: true
                    },
                    {
                        name: 'Wins | Losses',
                        value: '__Wins/Losses Ratio:__ ' + numberWithCommas(player.warlords_sr.WL) + '\n' +
                            '__Games Played:__ ' + numberWithCommas(player.warlords_sr.plays) + '\n' +
                            '__Wins:__ ' + numberWithCommas(player.warlords_hypixel.wins) + '\n' +
                            '__Losses:__ ' + numberWithCommas(player.warlords_hypixel.losses) + '\n' +
                            '__Blue wins:__ ' + numberWithCommas(player.warlords_hypixel.wins_blu) + '\n' +
                            '__Red wins:__ ' + numberWithCommas(player.warlords_hypixel.wins_red) + '\n' +
                            '__Games Left / AFK:__ ' + numberWithCommas(player.warlords_hypixel.penalty) + '\n',
                        inline: true
                    },
                    // {
                    //     name: '\u200B',
                    //     value: '\u200B'
                    // },
                    {
                        name: 'Capture The Flag',
                        value: '__Wins:__ ' + numberWithCommas(player.warlords_hypixel.wins_capturetheflag) + '\n' +
                            '__Wins on Blue:__ ' + numberWithCommas(player.warlords_hypixel.wins_capturetheflag_blu) + '\n' +
                            '__Wins on Red:__ ' + numberWithCommas(player.warlords_hypixel.wins_capturetheflag_red) + '\n' +
                            '__Team Caps:__ ' + numberWithCommas(player.warlords_hypixel.flag_conquer_team) + '\n' +
                            '__Your Caps:__ ' + numberWithCommas(player.warlords_hypixel.flag_conquer_self) + '\n',
                        inline: true
                    },
                    {
                        name: 'Domination',
                        value: '__Wins:__ ' + numberWithCommas(player.warlords_hypixel.wins_domination) + '\n' +
                            '__Wins on Blue:__ ' + numberWithCommas(player.warlords_hypixel.wins_domination_blu) + '\n' +
                            '__Wins on Red:__ ' + numberWithCommas(player.warlords_hypixel.wins_domination_red) + '\n',
                        inline: true
                    },
                    {
                        name: 'Team Deathmatch',
                        value: '__Wins:__ ' + numberWithCommas(player.warlords_hypixel.wins_teamdeathmatch) + '\n' +
                            '__Wins on Blue:__ ' + numberWithCommas(player.warlords_hypixel.wins_teamdeathmatch_blu) + '\n' +
                            '__Wins on Red:__ ' + numberWithCommas(player.warlords_hypixel.wins_teamdeathmatch_red) + '\n',
                        inline: true
                    },
                ))
        } catch (e) {
            await message.reply(e.message)
        }
        return null
    }
}

function numberWithCommas(number: number) {
    if (!number) return '0'
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

