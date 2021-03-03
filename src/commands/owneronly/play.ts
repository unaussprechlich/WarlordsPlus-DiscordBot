import {Command, CommandoMessage} from "discord.js-commando";
import Logger from "../../util/Logger";
import {playYoutube} from "../../util/YtPlayer";
import {MessageEmbed} from "discord.js";

module.exports = class ClearCommand extends Command{
    constructor(discordClient) {
        super(discordClient, {
            name: "youtube",
            description: "YouTube.",
            group: "owneronly",
            memberName: "youtube",
            guildOnly: true,
            ownerOnly : true,
            throttling: {
                usages: 2,
                duration: 10
            },
            args : [{
                    key: "youtubelink",
                    prompt: "YouTube link",
                    type: "string",
                }
            ],
        });
    }
    async run(message: CommandoMessage, {youtubelink}){
        try{
            await playYoutube(message, youtubelink, false)
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
