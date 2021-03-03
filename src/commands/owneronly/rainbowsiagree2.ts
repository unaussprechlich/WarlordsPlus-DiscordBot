import {Command, CommandoMessage} from "discord.js-commando";
import Logger from "../../util/Logger";
import {playYoutube} from "../../util/YtPlayer";
import {GuildMember, Message, MessageEmbed, Snowflake} from "discord.js";
import UserError from "../../util/UserError";
import {rainbowdisagree2Quotes} from "../../resources/Quotes";

export default class RainbowDisagree2Command extends Command{

    constructor(discordClient) {
        super(discordClient, {
            name: "rainbowdisagree2",
            description: "rainbowdisagree2.",
            group: "owneronly",
            memberName: "rainbowdisagree2",
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
        if(RainbowDisagree2Command.retards.indexOf(message.author.id) !== -1){
            await message.reply(rainbowdisagree2Quotes[Math.floor(Math.random()*rainbowdisagree2Quotes.length)])
        }
    }

    async run(message: CommandoMessage, {member} : {member: GuildMember}){
        try{
            if(!member) throw new UserError("Yo, retard. Specify the retard!")
            if(RainbowDisagree2Command.retards.indexOf(member.id) !== -1){
                RainbowDisagree2Command.retards.splice(RainbowDisagree2Command.retards.indexOf(member.id))
            } else {
                RainbowDisagree2Command.retards.push(member.id)
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
