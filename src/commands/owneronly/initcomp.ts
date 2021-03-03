import {Command, CommandoMessage} from "discord.js-commando";
import Logger from "../../util/Logger";
import {getGuildSettingsForMessage} from "../../database/GuildSettings";
import CompetitiveRole from "../../roles/CompetitiveRole";
import {DiscordToMinecraftModel} from "../../database/DiscordToMinecraft";
import ModRole from "../../roles/ModRole";
import {discordClient} from "../../main";
import UserError from "../../util/UserError";
import {MessageEmbed} from "discord.js";

module.exports = class ClearCommand extends Command{
    constructor(discordClient) {
        super(discordClient, {
            name: "initcompetitive",
            description: "Init competitive in a Guild.",
            group: "owneronly",
            aliases : ["enablecompetitive", "enablecomp", "initcomp"],
            memberName: "initcompetitive",
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
            const guild = message.guild;

            if(!CompetitiveRole.isCreated(guild)){
                await CompetitiveRole.addToGuild(guild)
            }

            if(!ModRole.isCreated(guild)){
                await ModRole.addToGuild(guild)
            }

            const competitiveRole = CompetitiveRole.get(guild)

            if(guildSettings.competitive.enabled){
                throw Error("Competitive is already enabled in this Guild.")
            }

            const category = await guild.channels.create("⚔ Competitive", {
                type : "category",
                topic : "Competitive Warlords",
                permissionOverwrites:[
                    {
                        id : message.guild.id,
                        deny: ['VIEW_CHANNEL', "VIEW_CHANNEL"]
                    },{
                        id : competitiveRole.id,
                        allow: ['VIEW_CHANNEL', "VIEW_CHANNEL"]
                    },{
                        id: discordClient.user.id,
                        allow: ['VIEW_CHANNEL', "VIEW_CHANNEL"]
                    }
                ]
            })

            const status = await guild.channels.create("status", {
                type : "text",
                parent : category,
                permissionOverwrites:[
                    {
                        id : message.guild.id,
                        deny: ['SEND_MESSAGES', "VIEW_CHANNEL"]
                    },{
                        id : CompetitiveRole.id(guild),
                        allow: ["VIEW_CHANNEL"]
                    },{
                        id : ModRole.id(guild),
                        allow: ['SEND_MESSAGES', "VIEW_CHANNEL"]
                    },{
                        id: discordClient.user.id,
                        allow: ['SEND_MESSAGES', "VIEW_CHANNEL"]
                    }
                ]
            })

            const lobby = await guild.channels.create("🚌 Lobby", {
                type : "voice",
                parent : category
            })

            const blueteam = await guild.channels.create("🔵 Blue Team", {
                type : "voice",
                parent : category,
                permissionOverwrites:[
                    {
                        id : message.guild.id,
                        deny: ['CONNECT', "VIEW_CHANNEL"]
                    },{
                        id : CompetitiveRole.id(guild),
                        allow: ["VIEW_CHANNEL"]
                    },{
                        id : ModRole.id(guild),
                        allow: ['CONNECT', "VIEW_CHANNEL"]
                    },{
                        id: discordClient.user.id,
                        allow: ['CONNECT', "VIEW_CHANNEL"]
                    }
                ]
            })

            const redteam = await guild.channels.create("🔴 Red Team", {
                type : "voice",
                parent : category,
                permissionOverwrites:[
                    {
                        id : message.guild.id,
                        deny: ['CONNECT', "VIEW_CHANNEL"]
                    },{
                        id : CompetitiveRole.id(guild),
                        allow: ["VIEW_CHANNEL"]
                    },{
                        id : ModRole.id(guild),
                        allow: ['CONNECT', "VIEW_CHANNEL"]
                    },{
                        id: discordClient.user.id,
                        allow: ['CONNECT', "VIEW_CHANNEL"]
                    }
                ]
            })

            for (let member of guild.members.cache.values()) {
                const model = await DiscordToMinecraftModel.findOne({client_id : member.id}).exec()
                if(model){
                    await member.roles.add(competitiveRole.id)
                    await message.reply(`The user <@${model.client_id}> is linked to uuid ${model.minecraft_uuid} and therefore has been assigned the competitive role.`)
                }
            }

            guildSettings.competitive.categorychannel = category.id;
            guildSettings.competitive.voicechannels.blue = blueteam.id;
            guildSettings.competitive.voicechannels.red = redteam.id;
            guildSettings.competitive.voicechannels.lobby = lobby.id;
            guildSettings.competitive.textchannel = status.id;
            guildSettings.competitive.enabled = true;

            await guildSettings.save()
            Logger.info(`[OWNERONLY] ${message.member.displayName}:${message.member.id} has ENABLED competitive in guild ${message.guild.name}:${message.guild.id}`)
            await message.reply("Competitive has been enabled for this Server!")
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
