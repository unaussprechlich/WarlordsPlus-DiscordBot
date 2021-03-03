import {Command, CommandoMessage} from "discord.js-commando";
import Logger from "../../util/Logger";
import {playYoutube} from "../../util/YtPlayer";
import {getGuildSettingsForMessage, GuildSettingsModel} from "../../database/GuildSettings";
import CompetitiveRole from "../../roles/CompetitiveRole";
import UserError from "../../util/UserError";
import {MessageEmbed} from "discord.js";

module.exports = class ClearCommand extends Command{
    constructor(discordClient) {
        super(discordClient, {
            name: "disablecompetitive",
            description: "Init competitive in a Guild.",
            group: "owneronly",
            aliases : ["disablecomp"],
            memberName: "disablecompetitive",
            guildOnly: true,
            ownerOnly : true,
            throttling: {
                usages: 2,
                duration: 10
            }
        });
    }
    async run(message: CommandoMessage){
        try{
            const guildSettings = await getGuildSettingsForMessage(message.guild);

            if(!guildSettings.competitive.enabled){
                throw Error("Competitive is already disabled.")
            }

            try {
                deleteChannel(guildSettings.competitive.textchannel)
                deleteChannel(guildSettings.competitive.voicechannels.lobby)
                deleteChannel(guildSettings.competitive.voicechannels.blue)
                deleteChannel(guildSettings.competitive.voicechannels.red)
                deleteChannel(guildSettings.competitive.categorychannel)

                function deleteChannel(id : string) {
                    message.guild.channels.cache.find(value => value.id === id).delete("COMPETITIVE HAS BEEN DISABLED")
                }

                if(!CompetitiveRole.isCreated(message.guild)){
                    await CompetitiveRole.get(message.guild).delete("COMPETITIVE HAS BEEN DISABLED")
                }
            }catch (e) {
                Logger.error(e.message)
                console.error(e)
                await message.reply(e.message)
            }

            guildSettings.competitive.enabled = false
            guildSettings.competitive.textchannel = null
            guildSettings.competitive.categorychannel = null
            guildSettings.competitive.voicechannels.lobby = null
            guildSettings.competitive.voicechannels.blue = null
            guildSettings.competitive.voicechannels.red = null

            await guildSettings.save()

            Logger.info(`[OWNERONLY] ${message.member.displayName}:${message.member.id} has DISABLED competitive in guild ${message.guild.name}:${message.guild.id}`)
            await message.reply("Competitive has been disabled for this Server!")

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
