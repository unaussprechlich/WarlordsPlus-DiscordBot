import {Command, CommandoMessage} from "discord.js-commando";
import Logger from "../../util/Logger";
import {playYoutube} from "../../util/YtPlayer";
import {GuildMember, Message, MessageEmbed, Snowflake} from "discord.js";
import UserError from "../../util/UserError";
import {rainbowdisagree2Quotes, totalNoFunQuotes} from "../../resources/Quotes";

export default class NoFunCommand extends Command{

    constructor(discordClient) {
        super(discordClient, {
            name: "nofun",
            description: "nofun.",
            group: "owneronly",
            memberName: "nofun",
            guildOnly: true,
            ownerOnly : true,
            throttling: {
                usages: 2,
                duration: 10
            },
            args : [{
                    key: "member",
                    prompt: "GuildMember",
                    type: "member",
                }
            ],
        });
    }

    static retards : Array<Snowflake> = []

    static async onMessage(message : Message){
        if(NoFunCommand.retards.indexOf(message.author.id) !== -1){
            await message.reply(totalNoFunQuotes[Math.floor(Math.random()*totalNoFunQuotes.length)])
        }
    }

    async run(message: CommandoMessage, {member} : {member: GuildMember}){
        try{
            if(!member) throw new UserError("Yo, retard. Specify the retard!")
            if(NoFunCommand.retards.indexOf(member.id) !== -1){
                NoFunCommand.retards.splice(NoFunCommand.retards.indexOf(member.id))
            } else {
                NoFunCommand.retards.push(member.id)
            }
        }catch (e) {
            Logger.error(e.message)
            console.error(e)
            return message.embed(new MessageEmbed({
                    title: e.name,
                    color: "DARK_RED",
                    description : e.message
                }
            ));
        }
        return null
    }
}
