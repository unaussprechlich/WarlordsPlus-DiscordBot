import {Command, CommandInfo, CommandoMessage} from "discord.js-commando";
import Logger from "../util/Logger";
import {playYoutube} from "../util/YtPlayer";
import {MessageEmbed} from "discord.js";

export default class PlayCommand extends Command{

    readonly ytLink : string

    constructor(discordClient, name : string, description : string, youTubeLink : string) {
        super(discordClient,{
            name: name,
            description: description,
            group: "owneronly",
            memberName: name,
            guildOnly: true,
            ownerOnly : true,
            throttling: {
                usages: 2,
                duration: 10
            }
        });
        this.ytLink = youTubeLink
    }
    async run(message: CommandoMessage, {amount}){
        try{
            await playYoutube(message, this.ytLink, false)
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
