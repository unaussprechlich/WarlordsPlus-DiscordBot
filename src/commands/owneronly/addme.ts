import {Command, CommandoMessage} from "discord.js-commando";
import Logger from "../../util/Logger";
import {playYoutube} from "../../util/YtPlayer";

module.exports = class ClearCommand extends Command{
    constructor(discordClient) {
        super(discordClient, {
            name: "ricky",
            description: "Ricky.",
            group: "owneronly",
            memberName: "ricky",
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
            await playYoutube(message, "https://youtu.be/dQw4w9WgXcQ")
            return message.reply("The good shit!");
        }catch (e) {
            Logger.error(e)
        }
    }
}
