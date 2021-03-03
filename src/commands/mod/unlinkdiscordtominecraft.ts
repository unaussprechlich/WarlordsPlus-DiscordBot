import {Command, CommandoMessage} from "discord.js-commando";
import Logger from "../../util/Logger";
import ModRole from "../../roles/ModRole";
import {DiscordToMinecraftModel, getDiscordToMinecraftForMember} from "../../database/DiscordToMinecraft";

import {getPreviousNames, getWarlordsSRFromName} from "../../util/WarlordsSR";
import {GuildMember, MessageEmbed} from "discord.js";
import CompetitiveRole from "../../roles/CompetitiveRole"
import UserError from "../../util/UserError";

module.exports = class BalanceCommand extends Command{

    constructor(discordClient) {
        super(discordClient,{
            name : "unlinkdiscordtominecraft",
            description: "Unlinks a member from their minecraft uuid.",
            aliases: ["unlink"],
            group: "mod",
            memberName: "unlinkdiscordtominecraft",
            guildOnly : true,
            args : [
                {
                    key : "member",
                    prompt : "The member you would like to unlink.",
                    type: "member"
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
            await DiscordToMinecraftModel.deleteOne({client_id : member.id}).exec()
            await message.reply(`The GuildMember ${(member as GuildMember).displayName} has been unlinked!`);
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
