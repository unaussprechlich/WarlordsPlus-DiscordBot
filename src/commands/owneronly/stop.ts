import {Command, CommandInfo, CommandoMessage} from "discord.js-commando";
import Logger from "../../util/Logger";
import {leaveVoice} from "../../util/YtPlayer";
import {MessageEmbed} from "discord.js";

export default class PlayCommand extends Command{
    constructor(discordClient) {
        super(discordClient,{
            name: "stop",
            description: "Stop.",
            group: "owneronly",
            memberName: "stop",
            guildOnly: true,
            ownerOnly : true,
            throttling: {
                usages: 2,
                duration: 10
            }
        });
    }
    async run(message: CommandoMessage, {amount}){
        try{
            await leaveVoice(message)
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
