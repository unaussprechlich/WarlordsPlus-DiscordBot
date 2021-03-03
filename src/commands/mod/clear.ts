import {Command, CommandoMessage} from "discord.js-commando";
import {MessageEmbed, TextChannel} from "discord.js";
import Logger from "../../util/Logger";
import UserError from "../../util/UserError";

module.exports = class ClearCommand extends Command{
    constructor(discordClient) {
        super(discordClient, {
            name: "clear",
            description: "Clears x amount of messages",
            group: "mod",
            memberName: "clear",
            guildOnly: true,
            args: [
                {
                    key: "amount",
                    prompt: "The number of messages to delete.",
                    type: "integer"
                }
            ],
            throttling: {
                usages: 1,
                duration: 30
            }
        });
    }
    async run(message: CommandoMessage, {amount}){
        try{
            if(!message.channel.isText) return;
            const channel = message.channel as TextChannel;
            const messages =  await message.channel.messages.fetch({ limit: amount });
            await channel.bulkDelete(messages);
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
