import {Command, CommandoMessage} from "discord.js-commando";
import Logger from "../../util/Logger";
import ModRole from "../../roles/ModRole";
import {getDiscordToMinecraftForMember} from "../../database/DiscordToMinecraft";

import {getPreviousNames, getWarlordsSRFromName} from "../../util/WarlordsSR";
import {GuildMember, MessageEmbed} from "discord.js";
import CompetitiveRole from "../../roles/CompetitiveRole"
import UserError from "../../util/UserError";

module.exports = class BalanceCommand extends Command{

    constructor(discordClient) {
        super(discordClient,{
            name : "linkdiscordtominecraft",
            description: "Links a member from their minecraft uuid.",
            aliases: ["link"],
            group: "mod",
            memberName: "linkdiscordtominecraft",
            guildOnly : true,
            args : [
                {
                    key : "member",
                    prompt : "The member you would like to link.",
                    type: "member"
                }, {
                    key: "playername",
                    prompt: "Playername",
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
            throttling:{
                usages: 2,
                duration : 10
            }
        });
    }

    async run(message: CommandoMessage, {member, playername}) {
        try{
            //checks if the user has the right role, will bypass if he is the bot owner
            if(!await ModRole.hasRolePermission(message) && !this.client.isOwner(message.author)){
                return null;
            }

            const discordToMinecraft = await getDiscordToMinecraftForMember(member)

            const player = await getWarlordsSRFromName(playername)

            if(!player.uuid){
                throw new UserError("Can't find uuid for playername = " + playername)
            }

            if(player.warlords_sr.plays < 100){
                throw new UserError(`The player ${player.playername} requires at least 100 plays to be able to play competitive!`)
            }

            discordToMinecraft.minecraft_uuid = player.uuid

            if(!CompetitiveRole.isCreated(message.guild)){
                await CompetitiveRole.addToGuild(message.guild)
            }

            const competitiveRole = CompetitiveRole.get(message.guild)
            await (member as GuildMember).roles.add(competitiveRole.id)


            await discordToMinecraft.save();
            await message.channel.send(new MessageEmbed()
                .setColor("GREEN")
                .setThumbnail('https://crafatar.com/renders/body/' + player.uuid)
                .setURL('https://warlordssr.unaussprechlich.net/player/uuid/' + player.uuid)
                .setTitle(`${(member as GuildMember).displayName} has been linked to ${player.playername}`)
                .setDescription(getPreviousNames(player.name_history))
            )
        }catch (e) {
            Logger.error(e.message)
            if(typeof e !== typeof UserError)
                console.error(e)
            return message.embed(new MessageEmbed({
                    title: e.name,
                    color: "DARK_RED",
                    description : e.message
                }
            ));
        }
    }
}
