import {Command, CommandoMessage} from "discord.js-commando";
import Logger from "../../util/Logger";
import {newBalance, Player} from "../../teambalancer/TeamBalancer";
import {getGuildSettingsForMessage} from "../../database/GuildSettings";
import ModRole from "../../roles/ModRole";
import {DiscordToMinecraftModel} from "../../database/DiscordToMinecraft";
import {GuildMember, MessageEmbed} from "discord.js";
import UserError from "../../util/UserError";

const PLAYER_REQUIREMENT = 8

module.exports = class BalanceCommand extends Command{

    constructor(discordClient) {
        super(discordClient,{
            name : "balance",
            description: "Balances the teams",
            group: "competitive",
            aliases : ["rebal", "rebalance"],
            memberName: "balance",
            guildOnly : true,
            args : [
                {
                    key : "threshold",
                    prompt : "The allowed weight differences between the teams.",
                    type: "float",
                    default : 1.0
                }
            ],
            throttling:{
                usages: 2,
                duration : 10
            }
        });
    }

    async run(message: CommandoMessage, {threshold } : {threshold : number}) {
        try{
            //checks if the user has the right role, will bypass if he is the bot owner
            if(!await ModRole.hasRolePermission(message) && !this.client.isOwner(message.author)){
                return null;
            }

            const guild = message.guild;
            const guildSettings = await getGuildSettingsForMessage(message.guild);


            if(!guildSettings.competitive.enabled){
                throw Error("Competitive is not enabled in this guild. Ask a bot owner to enable it.")
            }

            const voiceChannels = {
                lobby : guild.channels.cache.find(it => it.id === guildSettings.competitive.voicechannels.lobby),
                blue: guild.channels.cache.find(it => it.id === guildSettings.competitive.voicechannels.blue),
                red: guild.channels.cache.find(it => it.id === guildSettings.competitive.voicechannels.red)
            }

            let membersArray : Array<GuildMember> = []
            membersArray.push(...voiceChannels.lobby.members.values())
            membersArray.push(...voiceChannels.blue.members.values())
            membersArray.push(...voiceChannels.red.members.values())

            let playersToBeBalanced : Array<Player> = []

            await Promise.all(membersArray.map(async it => {
                const uuid = await DiscordToMinecraftModel.findOne({client_id : it.id}).exec()
                if(!uuid || !uuid.minecraft_uuid){
                    throw new UserError(`The GuildMember <@${it.id}> is not linked to any minecraft account. \n<@&${ModRole.id(message.guild)}> please link the account with '-link <@${it.id}> username'`)
                }
                playersToBeBalanced.push({uuid : uuid.minecraft_uuid, member : it})
            }));

            if(playersToBeBalanced.length < PLAYER_REQUIREMENT) {
                throw new UserError(`The minimum requirement for a competitive game are ${PLAYER_REQUIREMENT} Players`)
            }

            await newBalance(playersToBeBalanced, message, voiceChannels, threshold);

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
